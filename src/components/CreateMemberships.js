import NavBar from "./NavBar";
import { useState } from 'react'
import NFTMembershipJSON from '../NFTMembership.json';
import { useLocation } from "react-router-dom";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";

export default function CreateMemberships() {
  
    
  const [formParams, updateFormParams] = useState({ name: '', description: '', price: ''});
  const [fileURL, setFileURL] = useState(null);
  const ethers = require("ethers");
  const [message, updateMessage] = useState('');

  //OnChangeFile: uploads the NFT image to IPFS
  async function OnChangeFile(e) {
      var file = e.target.files[0];
      //check for file extension
      try {
          //upload the file to IPFS
          const response = await uploadFileToIPFS(file);
          if(response.success === true) {
              console.log("Uploaded image to Pinata: ", response.pinataURL)
              setFileURL(response.pinataURL);
          }
      }
      catch(e) {
          console.log("Error during file upload", e);
      }
  }

  //uploadMetadataToIPFS: uploads the metadata to IPFS
  async function uploadMetadataToIPFS() {
      const {name, description, price} = formParams;
      if( !name || !description || !price || !fileURL)
          return;

      const nftJSON = {
          name, description, price, image: fileURL
      }

      try {
          const response = await uploadJSONToIPFS(nftJSON);
          if(response.success === true){
              console.log("Uploaded JSON to Pinata: ", response)
              return response.pinataURL;
          }
      }
      catch(e) {
          console.log("error uploading JSON metadata:", e)
      }
  }

  async function listNFT(e) {
      e.preventDefault();

      try {
          const metadataURL = await uploadMetadataToIPFS();
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          updateMessage("Please wait.. uploading (upto 5 mins)")

          let contract = new ethers.Contract(NFTMembershipJSON.address, NFTMembershipJSON.abi, signer)

          const price = ethers.utils.parseUnits(formParams.price, 'ether')
          let listingPrice = await contract.getListPrice()
          listingPrice = listingPrice.toString()

          let transaction = await contract.createToken(metadataURL, price, { value: listingPrice })
          await transaction.wait()

          alert("Successfully listed your NFT!");
          updateMessage("");
          updateFormParams({ name: '', description: '', price: ''});
          window.location.replace("/")
      }
      catch(e) {
          alert( "Upload error"+e )
      }
  }

  console.log("Working", process.env);
  return (
      <>
        <NavBar></NavBar>
        <div id="main-content" className="h-full bg-gray-50 relative overflow-y-auto lg:ml-64">
        <main>
          <div>
            <nav className="border-b p-6">
              <p className="text-4xl font-bold">NFT Membership Portal</p>
              <div className="font-bold flex mt-4">
                  <a href="/create-nfts" target="_self" className="mr-6 text-pink-500">
                    List NFT
                  </a>
                  <a href="/marketplace" target="_self" className="mr-6 text-pink-500">
                    Marketplace
                  </a>
              </div>
            </nav>
            <div style={{"minHeight":"100vh"}}>
        <div className="flex flex-col place-items-center mt-10" id="nftForm">
                <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
                <h3 className="text-center font-bold text-purple-500 mb-8">Upload your NFT to the marketplace</h3>
                    <div className="mb-4">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">NFT Name</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}></input>
                    </div>
                    <div className="mb-6">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="description">NFT Description</label>
                        <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" cols="40" rows="5" id="description" type="text" placeholder="Axie Infinity Collection" value={formParams.description} onChange={e => updateFormParams({...formParams, description: e.target.value})}></textarea>
                    </div>
                    <div className="mb-6">
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="price">Price (in ETH)</label>
                        <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="number" placeholder="Min 0.01 ETH" step="0.01" value={formParams.price} onChange={e => updateFormParams({...formParams, price: e.target.value})}></input>
                    </div>
                    <div>
                        <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="image">Upload Image</label>
                        <input type={"file"} onChange={OnChangeFile}></input>
                    </div>
                    <br></br>
                    <div className="text-green text-center">{message}</div>
                    <button onClick={listNFT} className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg">
                        List NFT
                    </button>
                </form>
            </div>
            </div>
          </div>
        </main>
         </div>
      </>
    );
  }