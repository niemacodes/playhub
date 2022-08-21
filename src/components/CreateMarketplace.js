import NavBar from "./NavBar";
import NFTTile from "../components/NFTTile";
import NFTMembershipJSON from "../NFTMembership.json";
import axios from "axios";
import { useState } from "react";

export default function Marketplace() {
const sampleData = [
    {
        "name": "Dapp University NFT Membership",
        "description": "Community Perks",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmSF9sEef9C3KpU1EKPxt7aKtuqAQHXGsYn6mQ7dYDyvSx",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "Issa Rae NFT Membership",
        "description": "Community Perks",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmRgYMx9s3Z7QqtJ4osb3tZGs3D8WWJHTqH4cAteSTkMsh",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "Mr. Beast NFT Membership",
        "description": "Community PerksT",
        "website":"http://axieinfinity.io",
        "image":"https://gateway.pinata.cloud/ipfs/QmNrxuqRoZQS2MmmEsbbnvtLoAKNimQsDDw1vginZYVnSE",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
];
const [data, updateData] = useState(sampleData);
const [dataFetched, updateFetched] = useState(false);

async function getAllNFTs() {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    let contract = new ethers.Contract(NFTMembershipJSON.address, NFTMembershipJSON.abi, signer)
    let transaction = await contract.getAllNFTs()
    const items = await Promise.all(transaction.map(async i => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

if(!dataFetched)
    getAllNFTs();

 
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
                  <a href="/marketplace" target="_self" className="mr-6 text-pink-500">
                    Marketplace
                  </a>
              </div>
            </nav>
            <div className="flex flex-col place-items-center mt-20">
                <div className="md:text-xl font-bold text-white">
                    Top NFTs
                </div>
                <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                    {data.map((value, index) => {
                        return <NFTTile data={value} key={index}></NFTTile>;
                    })}
                </div>
            </div>   
          </div>
        </main>
         </div>
      </>
    );
  }