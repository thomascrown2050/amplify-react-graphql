import React, { useState, useEffect } from "react";
import App from "./App";
import { Network, Alchemy, Utils } from "alchemy-sdk";

/*
const settings = {
  apiKey: "CB-QgjFspXqe-NNDKq694tzcDuAtmpNs", 
  network: Network.ETH_MAINNET, 
};

const alchemy = new Alchemy(settings);

*/

function TableBlockTransactions(props){

    /*
let blockToUse = props.block;

    const currentBlockTransactionsData = alchemy.core
  .getBlockWithTransactions(
   blockToUse
  ).then(data => {
    blockTimestamp = data["timestamp"];
    let bts = new Date (blockTimestamp * 1000);
    blockTimestampUTCString = bts.toUTCString();
    blockTimestampLocalString = bts.toTimeString();

    blockGasLimit = data["gasLimit"];
    blockGasLimitHexValue = blockGasLimit._hex;
    blockGasLimitDecValue = parseInt(blockGasLimitHexValue);
    blockGasUsed = data["gasUsed"];
    blockGasUsedHexValue = blockGasUsed._hex;
    blockGasUsedDecValue = parseInt(blockGasUsedHexValue);
    blockMaxPriorityFeePerGas = data["maxPriorityFeePerGas"];
    blockMaxFeePerGas = data["maxFeePerGas"];
    blockTransactionLength = data["transactions"].length;
    listTransactions = data["transactions"].map(
      (individualTransaction) =><tr key={individualTransaction.hash}><td key={individualTransaction.hash}><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/tx/` + individualTransaction.hash}>{individualTransaction.hash}</a></td><td>{Utils.formatEther(individualTransaction.value)}</td><td><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/address/` + individualTransaction.from}>{individualTransaction.from}</a></td><td><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/address/` + individualTransaction.to}>{individualTransaction.to}</a></td><td><a className="undecoratedLink" target='_blank' href={`https://etherscan.io/tx/${individualTransaction.hash}`}>View</a></td><td><button onClick={(e) => {createBookmark(e, individualTransaction.hash, authUserId, 1)}}><FontAwesomeIcon icon={faBookmark} /></button></td></tr>
      );
  })
*/

    return (
<div>
<h1>{props.block}</h1>
<table><tr><th>tx hash</th><th>ETH</th><th>From</th><th>To</th><th>View</th><th>Save</th></tr>{props.tx}</table>        
</div>
    );
}

export default TableBlockTransactions;