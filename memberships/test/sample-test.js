const { ethers } = require("hardhat");

describe("NFTMembership", function() {
  it("Should create and execute market sales", async function() {
    /* deploy the membership contract */
    const NFTMembership = await ethers.getContractFactory("NFTMembership")
    const nftMembership = await NFTMembership.deploy()
    await nftMembership.deployed()

    let listingPrice = await nftMembership.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')

    /* create two tokens */
    await nftMembership.createToken("https://www.mytokenlocation.com", auctionPrice, { value: listingPrice })
    await nftMembership.createToken("https://www.mytokenlocation2.com", auctionPrice, { value: listingPrice })

    const [_, buyerAddress] = await ethers.getSigners()

    /* execute sale of token to another user */
    await nftMembership.connect(buyerAddress).createMarketSale(1, { value: auctionPrice })

    /* resell a token */
    await nftMembership.connect(buyerAddress).resellToken(1, auctionPrice, { value: listingPrice })

    /* query for and return the unsold items */
    let items = await nftMembership.fetchMarketItems()
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nftMembership.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    console.log('items: ', items)
  })
})
