import { nftAddress, nftMarketplaceAddress } from "./utils/options"
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json"
import NFT from "../artifacts/contracts/NFT.sol/NFT.json"
import axios from "axios"
import { useEffect, useState } from "react";
import NFTCard from './components/nftCard.js';
import connect from "./utils/auth"
import { useRouter } from "next/router";

export default function Profile(){
    const[ownedNFTs, setOwnedNFTs] = useState([])
    const [account, setAccount] = useState()
    const router = useRouter()
 

    useEffect( ()=>{
            loadContent()
        }, [])


        async function loadContent(){
            const{account, web3} = await connect()
            if(account && web3){
                setAccount(account)

                const nftMarketplaceContract = new web3.eth.Contract(NFTMarketplace.abi, nftMarketplaceAddress);
                const nftContract = new web3.eth.Contract(NFT.abi, nftAddress);
    
                try{
                    const items = await nftMarketplaceContract.methods.fetchAllItemsOfOwner().call({from: account})
                    console.log(items)
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
                    
                   setOwnedNFTs(NFTs)
                }catch(err){
                    console.log(err)
                }
            }
           
          
        }
   
    return(
        <div className="flex-row py-4 px-12">
            <div className="text-center mt-6 mb-12 text-white">
                <h1 className="text-5xl  font-bold ">YOUR COLLECTION</h1>
                <h2>That's how you spent your money</h2>            
            </div>
            
            <div className="flex">
           
                {
                    ownedNFTs.map(nft => {
                        console.log(ownedNFTs)
                        return(
                            <NFTCard key={nft.id} nft={nft} buyable={false}/>
                        )
                    })
                }
            </div>
        </div>
    )
}