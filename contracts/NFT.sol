//SPDX-License-Identifier: APACHE

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address private marketplaceAddress;


    constructor(address deployedMarketplaceAddress) ERC721('Funny Token','FTT'){
        marketplaceAddress = deployedMarketplaceAddress;
    }

    function createToken(string memory tokenURI) public returns(uint256){
        _tokenIds.increment();
        uint newItemId = _tokenIds.current();

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        approve(marketplaceAddress, newItemId);
        return newItemId;
    }
}
