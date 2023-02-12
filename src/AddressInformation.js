import React, { useState, useEffect } from "react";
import {whales_data, buildWhaleTable} from "./Whales";
import * as ReactDOM from 'react-dom';
import { API, Storage, Auth} from "aws-amplify";
import {
    createBookmark as createBookmarkMutation
  } from "./graphql/mutations";
import { Network, Alchemy, Utils } from "alchemy-sdk";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faBookmark } from '@fortawesome/free-solid-svg-icons'

import {
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import toast, { Toaster } from 'react-hot-toast';


let authUserId;

//Setup user authentication data
Auth.currentAuthenticatedUser({
  bypassCache: false // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
}).then((user) => 
  {authUserId = user.attributes["sub"];
}).catch((err) => console.log(err));

const settings = {
  apiKey: "CB-QgjFspXqe-NNDKq694tzcDuAtmpNs", 
  network: Network.ETH_MAINNET, 
};

const alchemy = new Alchemy(settings);



/*
Things to fetch:
- Add whale label if available! 
- P1 Total USD value
- DONE ETH balance, and other token balance values
- DONE NFTs owned (NFTs sold, NFTs minted)
- P1 # transactions, contracts they've interacted with, first date, last date
- P1 Addresses they've interacted with
- P2: Gas spent
- Logic for detecting blue chip NFT more easily and then indicating if so easily/simply
*/


let ethBalance;
let ethBalanceFormatted;
let tokenBalanceResponse;
let tokenList;
let erc20TokenCount;
let addressUpdate;
let addressContractMetadata;
let addressContractMetadataDecimals;
let transferFromList;
let transferToList;
let transferFromCount;
let transferToCount;
let resFrom;
let resTo;
let ownedNfts = [];
let nftsList;
let nftsOwnedCount;
let soldNFTsResponse;
let nftsSoldList;
let nftsSoldCount;
let ensContractAddress = "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85";
let fullENSString;


const AddressDetailsComponent =  (props)  =>{

    let walletAddress = props.address;

    async function getENS(){
    setTimeout(alchemy.nft.getNftsForOwner(walletAddress, {contractAddresses: [ensContractAddress]}).then(
        function(data){
          //console.log(data);
          if(data["ownedNfts"].length>0){
            fullENSString = data["ownedNfts"][0]["title"];
            document.getElementById("ensNames").innerHTML = "ENS: "+fullENSString;
          }}
    ))
        };

    async function getBalances(){
    setTimeout(1000);        
    ethBalance  = await alchemy.core.getBalance(walletAddress, "latest");
    try{
    ethBalanceFormatted = Utils.formatEther(ethBalance["_hex"]);
    //Q; Why do I need to do the innerHTML thing - why doesn't it just load then feed as normal variable below
    document.getElementById("ethBalanceSpan").innerHTML = ethBalanceFormatted;
    }catch(error){console.log(error)};

    //TODO - see if you can pass in default tokens flag so it filters to top 100, getting spam results right now
    tokenBalanceResponse = await alchemy.core.getTokenBalances(walletAddress);
    try{
        tokenList = tokenBalanceResponse["tokenBalances"].map((individualTokenBalance) => (
        "<li key='tokenBalanceKey"+individualTokenBalance.contractAddress+"'><span id='contractAddressLabel"+individualTokenBalance.contractAddress+"'>"+individualTokenBalance.contractAddress+"</span>: <span id='contractAddressBalanceLabel"+individualTokenBalance.contractAddress+"'>"+parseInt(individualTokenBalance.tokenBalance)+"</span></li>"
        )
        );
        //need this b/c unexplained comma otherwise //https://stackoverflow.com/questions/67345146/how-can-i-remove-the-commas-from-a-html-list-created-from-an-array-of-objects
        tokenList =  tokenList.join('');
        erc20TokenCount = tokenBalanceResponse["tokenBalances"].length;   
        document.getElementById("tokenBalanceSpan").innerHTML = tokenList;
        }catch(error){console.log(error)};

        addressUpdate = tokenBalanceResponse["tokenBalances"].map((individualTokenBalance) => (
            alchemy.core.getTokenMetadata(individualTokenBalance.contractAddress).then((data) => 
            (
                addressContractMetadata = data,
                document.getElementById("contractAddressLabel"+individualTokenBalance.contractAddress).innerHTML = addressContractMetadata.name,
                document.getElementById("contractAddressBalanceLabel"+individualTokenBalance.contractAddress).innerHTML = (Number(Utils.formatUnits(individualTokenBalance.tokenBalance, addressContractMetadata.decimals))).toLocaleString()
                //individualTokenBalance.tokenBalance/(10^addressContractMetadata.decimals)
            ))
        ));


    }    
    

async function getFromTransfers(){
        setTimeout(1000);
        resFrom = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        fromAddress: walletAddress,
        excludeZeroValue: true,
        category: ["external", "internal", "erc20", "erc721", "erc1155"],
        order: "desc"
      });
        
      try{
    transferFromList = resFrom["transfers"].map(transfer => <li key={transfer.uniqueId}><a className="undecoratedLink" rel="noopener noreferrer" target='_blank' href={`https://etherscan.io/tx/${transfer.hash}`}>{transfer.hash}</a></li>);
    transferFromCount = resFrom["transfers"].length;   
    }catch(error){console.log(error)};
    }

async function getToTransfers(){
        setTimeout(1000);
        resTo = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toAddress: walletAddress,
        excludeZeroValue: true,
        category: ["external", "internal", "erc20", "erc721", "erc1155"],
        order: "desc"
      });
        
    try{
        transferToList = resTo["transfers"].map(transferTo => <li key={transferTo.uniqueId}><a className="undecoratedLink" rel="noopener noreferrer" target='_blank' href={`https://etherscan.io/tx/${transferTo.hash}`}>{transferTo.hash}</a></li>);
        transferToCount = resTo["transfers"].length;
        //console.log(resTo);
    }catch(error){console.log(error)};
}

async function getNFTSForThisAddress(){
        setTimeout(1000);
    let ownedNftsObject = await alchemy.nft.getNftsForOwner(walletAddress);
    ownedNfts = ownedNftsObject["ownedNfts"];
    nftsList = ownedNfts.map(ownedNft => <li key={ownedNft.contract["address"]+ownedNft.tokenId}><a className="undecoratedLink" rel="noopener noreferrer" target='_blank'  href={`https://etherscan.io/nft/${ownedNft.contract["address"]}/${ownedNft.tokenId}`}>{ownedNft.contract["name"]}: {ownedNft.tokenId}</a></li>);
    nftsOwnedCount = ownedNfts.length;
        }

async function soldNFTs(){
    setTimeout(1000);
    soldNFTsResponse = await alchemy.nft
     .getNftSales({
    "sellerAddress": walletAddress
  });
  //console.log(soldNFTsResponse);
  try{
    nftsSoldList = soldNFTsResponse["nftSales"].map(sale => <li key={sale.transactionHash}><a className="undecoratedLink" rel="noopener noreferrer" target='_blank' href={`https://etherscan.io/tx/${sale.transactionHash}`}>{sale.contractAddress}: {sale.tokenId} From {sale.sellerAddress} To {sale.buyerAddress} for {Utils.formatEther(sale.sellerFee.amount)} ETH</a></li>);
    nftsSoldCount = soldNFTsResponse["nftSales"].length;
}catch(error){console.log(error)};
}

//Look for whale address matches and update in the DOM
var resultWhale = whales_data.find(item => item.address === walletAddress);
if(resultWhale!=undefined)
{
  try{
  document.getElementById("whaleLabel").innerHTML = "Whale: "+resultWhale.name;
  }
  catch(error){}
}

    getENS();
    getBalances();
    getFromTransfers();
    getToTransfers();
    getNFTSForThisAddress();
    soldNFTs();

    useEffect(() => { }, [])

return (
<View>
<div>
<Toaster />
</div>
<div id="accountContent">

<span><h1 id="ensNames"></h1></span>
<span><h1 id="whaleLabel"></h1></span>

<div id="accountPageNavigation">
<span><a className="undecoratedLink" rel="noopener noreferrer" href='#sectionTokens'>Tokens</a></span> &nbsp; | &nbsp;   
<span><a className="undecoratedLink" rel="noopener noreferrer" href='#sectionFromTransfers'>From Transfers</a></span> &nbsp; | &nbsp;   
<span><a className="undecoratedLink" rel="noopener noreferrer" href='#sectionToTransfers'>To Transfers</a></span>  &nbsp; | &nbsp;      
<span><a className="undecoratedLink" rel="noopener noreferrer" href='#sectionNFTsOwned'>NFTs Owned</a></span>  &nbsp; | &nbsp;          
<span><a className="undecoratedLink" rel="noopener noreferrer" href='#sectionNFTsSold'>NFTs Sold</a></span>  &nbsp; | &nbsp;              
<span><a className="undecoratedLink" rel="noopener noreferrer" target="_blank" href={`https://etherscan.io/address/${walletAddress}`}>View on Etherscan</a></span>  &nbsp; | &nbsp;              
<span><a className="undecoratedLink" rel="noopener noreferrer" target="_blank" href={`https://opensea.io/${walletAddress}`}>View on OpenSea</a></span>    
</div>
<br />

<div id="sectionTokenHoldings">
<h1>Tokens</h1>
ETH: <span id="ethBalanceSpan"></span>
<br />
Other tokens: <span id="tokenBalanceSpan"><ul>{tokenList}</ul></span>
</div>

<div id="sectionFromTransfers">
<h1>Transfers</h1>
Transfers From ({transferFromCount}):
<ul>{transferFromList}</ul>
</div>

<div id="sectionToTransfers">
Transfers To ({transferToCount}):
<ul>{transferToList}</ul>
</div>

<h1>NFTs</h1>
<div id="sectionNFTsOwned">
NFTs Owned ({nftsOwnedCount}): 
<ul>{nftsList}</ul>
</div>
<div id="sectionNFTsSold">
NFTs Sold ({nftsSoldCount}):
<ul>{nftsSoldList}</ul>
</div>
</div>
</View>
    );
}

export default AddressDetailsComponent;
