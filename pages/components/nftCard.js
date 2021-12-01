import { nftAddress, nftMarketplaceAddress } from "../utils/options";
import NFTMarketplace from "../../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json"
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json"

import { useRouter } from "next/router"
import connect from "../utils/auth";
import { useState } from "react";




export default function NFTCard({nft, buyable}){
    const router = useRouter()
    const [nftPrice, setPrice] = useState()
    const [isSelling, setIsSelling] = useState(false)

    
    async function listItemOnSale(){
        const {account, web3} = await connect()
        if(nftPrice){
            const contract = new web3.eth.Contract(NFTMarketplace.abi, nftMarketplaceAddress)
            const nftContract = new web3.eth.Contract(NFT.abi, nftAddress)
            const listingFees = web3.utils.toWei('.025', 'ether')
            nftContract.methods.approve(nftMarketplaceAddress, nft.id).send({from: account}).then(confirmations =>{
                contract.methods.listItemOnSale(nft.id, nftAddress, web3.utils.toWei(nftPrice.toString(), 'ether')).send({
                    from: account,
                    value: listingFees,
                }).on('receipt', transaction => {
                    console.log("redirecting")
                    router.reload()
                }); 
            })
            
        }
        

       
    }

    async function buyNFT(){
        const {account, web3} = await connect()
        const nftMarketplaceContract = new web3.eth.Contract(NFTMarketplace.abi, nftMarketplaceAddress)
        nftMarketplaceContract.methods.sellMarketItem(nft.id, nftAddress).send({from: account, value:  web3.utils.toWei(nft.price.toString(), 'ether')}).on('receipt', transaction => {
            router.push('/profile')
        })
    }


    return(
        <div className="rounded-lg bg-black-600 w-1/5 text-white mr-5">
            <img className="w-full rounded-t-lg" src={nft.image}></img>
            <div className="p-4 flex flex-col justify-between">
                <div>  
                    <h2 className="text-lg font-bold">{nft.title}</h2>
                    <p className="text-green-600">Owner: [0x...{nft.owner.substring(36,42)}]</p>
                    
                </div>
                <div className="h-14">
                    <p className="mt-2">{nft.description.substring(0,80)}</p>
                </div>
                <div className="flex justify-start space-x-6  mt-2">
                    
                    <p>{nft.onSale ? nft.price : 0} MATIC</p>
                    <p>{nft.lastPrice} MATIC</p>
                </div>
                <div className='flex '>
                    {!nft.onSale &&
                        <div className="flex mt-3 justify-between">
                            <button className="bg-green-600 py-2 px-12 rounded-full " onClick={() => {
                                    if(isSelling) {
                                        listItemOnSale()
                                    }else{
                                        setIsSelling(true)
                                    }
                                }}>Sale</button>
                            {isSelling && <input className="py-1 px-3 rounded-full ml-2 text-black-600 border-none focus:border-none w-4/5" type='text' onChange={(e)=>{setPrice(e.target.value)}} placeholder={nft.lastPrice}/>}
                        
                        </div> 
                    }
                    {
                        nft.onSale && !buyable ? <button className="py-2 px-12 rounded-full mt-2 cursor-default bg-red-600">On Sale</button> : <></>
                    }
                    {buyable &&
                        <div className="flex justify-end">
                            <button className="bg-green-600 py-2 px-12 rounded-full mt-3" onClick={buyNFT}>Buy</button>
                        </div>
                    
                    }
                </div>
                
            </div>
           
        </div>
    )
}