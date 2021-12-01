import {useState, useEffect} from 'react'
import axios from "axios"

import NFTCard from './components/nftCard'

import {nftAddress, nftMarketplaceAddress} from './utils/options'
import connect from './utils/auth'

import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json"
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"



export default function Home() {
  const [NFTs, setNFTs] = useState([])
  const [account, setAccount] = useState()

  useEffect(async () => {
    const {account, web3} = await connect()

    if(account && web3){

      setAccount(account)
    
      const nftMarketplaceContract = new web3.eth.Contract(NFTMarketplace.abi, nftMarketplaceAddress);
      const nftContract = new web3.eth.Contract(NFT.abi, nftAddress);
  
      const items = await nftMarketplaceContract.methods.fetchAllItemsOnSale().call()
      const NFTs = await Promise.all(items.map(async nft => {
              const tokenURI = await nftContract.methods.tokenURI(nft.tokenId).call()
              const meta = await axios.get(tokenURI)
  
              const item = {
                  id: nft.tokenId,
                  title: meta.data.title,
                  description: meta.data.description,
                  image: meta.data.image, 
                  owner: nft.owner,
                  price: web3.utils.fromWei(nft.price.toString(), 'ether'),
                  lastPrice: web3.utils.fromWei(nft.lastPrice.toString(), 'ether'),
                  onSale: nft.onSale,
              }
              return item
              
          }));
          setNFTs(NFTs)
    }
  }, [])
  

  




  return (
    <div className="flex-row py-4 px-12">
      
       <div className="text-center mt-6 mb-12 text-white">
          <h1 className="text-5xl  font-bold ">BUY AWESOME NFTs</h1>
          <h2>Search through 2+ NFTs made by random and not-so-skilled artists</h2>            
        </div>
        <div>
          <div className="flex">
            {
                NFTs.map(nft => {
                  if(nft.owner != account){
                    return(
                        <NFTCard key={nft.id} buyable={true} nft={nft}/>
                    )
                  }
                })
            }
          </div>
        </div>
    </div>
  )
}
