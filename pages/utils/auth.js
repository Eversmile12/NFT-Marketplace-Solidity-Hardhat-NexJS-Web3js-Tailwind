import  Web3Modal  from 'web3modal'
import Web3 from "web3"

    export default async function connect(){
        const modal = new Web3Modal()
        console.log("connecting")
        const provider = await modal.connect()
         

        const connection = {
            account:undefined,
            web3: undefined
        }
        if(provider){
            const web3 = new Web3(provider)
        
            const accounts = await web3.eth.getAccounts()
            console.log(accounts)
            connection = {
                account: accounts[0],
                web3
            }
        
        }
        
        return connection
    }
