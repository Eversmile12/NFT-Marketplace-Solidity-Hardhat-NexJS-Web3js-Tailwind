import Link from 'next/link'
import { useEffect, useState } from 'react'
import connect from '../utils/auth'


export default function Nav(){
    const [account, setAccount] = useState()

    useEffect(()=>{showAccount()},[])

    async function showAccount(){
        const {account} = await connect()
        setAccount(account.substring(36,42))
        
    }

    return(
        <div className='flex px-12 py-4 bg-black-800 border-b  text-white'>
            <div className="flex flex-grow items-center mt-2">
                <Link href="/"><a className="text-xl font-bold block"><h2>Buyable</h2></a></Link>
                <Link href="/"><a className="ml-12 block mt-1">Gallery</a></Link>
                
            </div>
            <div className="mt-2 flex">
                
                <Link href="/profile"><a className="mr-3 py-2 px-8 border rounded-full">Profile</a></Link>
                <Link  href="/createnft"><a className="mr-4 py-2 px-6 bg-green-600 rounded-full">CreateNFT</a></Link>
                <p className="text-green-600 mt-2">Account: [0x...{account}]</p>
                
                
            </div>

      
        </div>
    )
}