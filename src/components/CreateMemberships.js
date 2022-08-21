import NavBar from "./NavBar";
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'
import {
  membershipAddress
} from '../config'
import NFTMembership from '../NFTMembership.json'

export default function CreateMemberships() {
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  useEffect(() => {
    loadNFTs()
  }, [])
  async function loadNFTs() {
    /* create a generic provider and query for unsold market items */
    const provider = new ethers.providers.JsonRpcProvider()
    const contract = new ethers.Contract(membershipAddress, NFTMembership.abi, provider)
    const data = await contract.fetchMarketItems()

    /*
    *  map over items returned from smart contract and format 
    *  them as well as fetch their token metadata
    */
    const items = await Promise.all(data.map(async i => {
      const tokenUri = await contract.tokenURI(i.tokenId)
      const meta = await axios.get(tokenUri)
      let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
      let item = {
        price,
        tokenId: i.tokenId.toNumber(),
        seller: i.seller,
        owner: i.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
      }
      return item
    }))
    setNfts(items)
    setLoadingState('loaded') 
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(membershipAddress, NFTMembership.abi, signer)

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')   
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price
    })
    await transaction.wait()
    loadNFTs()
  }
  if (loadingState === 'loaded' && !nfts.length) return (<h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>)
    
  return (
      <>
        <NavBar></NavBar>
        <div id="main-content" className="h-full bg-gray-50 relative overflow-y-auto lg:ml-64">
        <main>
          <div>
            <nav className="border-b p-6">
              <p className="text-4xl font-bold">NFT Membership Portal</p>
              <div className="text-3xl font-bold flex mt-4">
                  <a href="/create-nfts" target="_self" className="mr-6 text-pink-500">
                    List NFT
                  </a>
                  <a href="/dashboard" target="_self" className="mr-6 text-pink-500">
                    Dashboard
                  </a>
              </div>
            </nav>
          </div>
        </main>
         </div>
      </>
    );
  }