const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

// Create a new NFT
// Check NFT owner of is == to expected owner address
// List new NFT on Marketplace
// Fetch all marketplace items
// Put NFT on Sale
// Fetch all Marketplace items on sale
// Sale NFT
// 

let marketplace;
let nft;

describe("NFT", function () {

  it("Should deploy a new NFT and NFT Marketplace contracts", async function(){
    const Marketplace = await ethers.getContractFactory("NFTMarketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.deployed();

    const NFT = await ethers.getContractFactory('NFT');
    nft = await NFT.deploy(marketplace.address);
    
    await nft.deployed();
  })
  it("Should create a new NFT", async function () {

    const tokenId = await nft.createToken("https://www.tokeuri.com")
    const [owner, buyer] = await ethers.getSigners();
    const ownerOfToken = await nft.ownerOf(1).toString();
    expect(ownerOfToken == owner)
    expect(ownerOfToken!= buyer)
  
   
  });

  it("Should list a new NFT on the Marketplace", async function(){

    let itemsTemp = await marketplace.fetchAllItems()
    
    itemsTemp = await Promise.all(itemsTemp.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);
      let item = {
        id: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        owner: i.owner,
        lastSeller: i.lastSeller,
        price: i.price.toString(),
        tokenUri
      }
      return item
    }))

    expect(itemsTemp.length == 0)

    await marketplace.createMarketItem(1, nft.address);

    let items = await marketplace.fetchAllItems()
    
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);
      let item = {
        id: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        owner: i.owner,
        lastSeller: i.lastSeller,
        price: i.price.toString(),
        tokenUri
      }
      return item
    }))

    expect(items.length == 1)
    
  });

  it("Should fail - Only Owner can list", async function(){
    const [owner, buyer] = await ethers.getSigners();
    let hasFailed = false;
    try{
      await marketplace.connect(buyer).createMarketItem(1, nft.address);
    }catch(e){
      hasFailed=true;
    }
    assert.equal(hasFailed, true);
  });

  it("Should put a new item on sale", async function(){
    let itemsTemp = await marketplace.fetchAllItemsOnSale()
    try{
      itemsTemp = await Promise.all(itemsTemp.map(async i => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let item = {
          id: i.itemId.toString(),
          tokenId: i.tokenId.toString(),
          owner: i.owner,
          lastSeller: i.lastSeller,
          price: i.price.toString(),
          tokenUri
        }
        return item
      }))
    }catch(e){

    }
  

    expect(itemsTemp.length == 0)




    const listingFees = ethers.utils.parseUnits('0.025', 'ether');

    await marketplace.listItemOnSale(1, nft.address, listingFees, {value: listingFees});



    let items = await marketplace.fetchAllItemsOnSale()
    
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);
      let item = {
        id: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        owner: i.owner,
        lastSeller: i.lastSeller,
        price: i.price.toString(),
        tokenUri
      }
      return item
    }))
   
    expect(items.length == 1)
  });

  it("Should sale a NFT", async function(){
    const [_, buyer] = await ethers.getSigners();
    const listingFees = ethers.utils.parseUnits('0.025', 'ether');
    await marketplace.connect(buyer).sellMarketItem(1, nft.address, {value: listingFees})
    const owner = await nft.ownerOf(1)
    assert.equal(owner, buyer.address)


    let items = await marketplace.fetchAllItems()
    
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);
      let item = {
        id: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        owner: i.owner,
        lastSeller: i.lastSeller,
        price: i.price.toString(),
        onSale: i.onSale,
        tokenUri
      }
      return item
    }))

    expect(items.filter(item => item.onSale == true).length == 0)
    
  })

  it("Should fail - NFT doesn't exists and can't be sold", async function(){
    const [_, buyer] = await ethers.getSigners();
    const listingFees = ethers.utils.parseUnits('0', 'ether');
    let owner;
    try{
      await marketplace.connect(buyer).sellMarketItem(2, nft.address, {value: listingFees})
      owner = await nft.ownerOf(2)
    }catch(e){
    }
   
    
    assert.notEqual(owner, buyer.address)
  })

  it("Should see updated item settings", async function(){
    const [owner, buyer] = await ethers.getSigners();
    let items = await marketplace.fetchAllItems()
    
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);
      let item = {
        id: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        owner: i.owner,
        lastSeller: i.lastSeller,
        price: i.price.toString(),
        onSale: i.onSale,
        tokenUri
      }
      return item
    }))
    const item = items[0];

    assert.equal(item.owner, buyer.address)
    assert.notEqual(item.lastPrice, '0')
    assert.equal(item.price, '0')
    assert.equal(item.lastSeller, owner.address)
    assert.equal(item.onSale, false)
  })

  it("Should see updated buyer items", async function(){
    const [owner, buyer] = await ethers.getSigners()
    console.log(buyer.address)

    let items = await marketplace.connect(buyer).fetchAllItemsOfOwner()
    
    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId);
      let item = {
        id: i.itemId.toString(),
        tokenId: i.tokenId.toString(),
        owner: i.owner,
        lastSeller: i.lastSeller,
        price: i.price.toString(),
        tokenUri
      }
      return item
    }))

    console.log(items)

    expect(items.length == 1)
  })
});
