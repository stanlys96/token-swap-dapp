import { BigNumber, ethers } from "ethers";
import { contract, tokenContract } from "./contract";
import { toEth } from "./ether-utils";

export async function swapEthToToken(tokenName, amount) {
  try {
    let tx = { value: toWei(amount) };

    const contractObj = await contract();
    const data = await contractObj.swapEthToToken(tokenName, tx);

    const receipt = await data.wait();
    return receipt;
  } catch (e) {
    return parseErrorMsg(e);
  }
}

export async function hasValidAllowance(owner, tokenName, amount) {
  try {
    console.log("????");
    const contractObj = await contract();
    const address = await contractObj.getTokenAddress(tokenName);
    console.log(address, "<<< address");
    const tokenContractObj = await tokenContract(address);
    console.log(tokenContractObj, "????");
    const data = await tokenContractObj.allowance(
      owner,
      "0x6facf2fB7d6A12B0Ae49f96Fd2c98224E9426726"
    );

    console.log(data, "<<< data");

    const result = BigNumber.from(data.toString()).gte(
      BigNumber.from(toWei(amount))
    );

    console.log(result, "<<< result");

    return result;
  } catch (e) {
    console.log(e, "<<< e");
    return parseErrorMsg(e);
  }
}

export async function swapTokenToEth(tokenName, amount) {
  try {
    const contractObj = await contract();
    const data = await contractObj.swapTokenToEth(tokenName, toWei(amount));

    const receipt = await data.wait();
    return receipt;
  } catch (e) {
    return parseErrorMsg(e);
  }
}

export async function swapTokenToToken(srcToken, destToken, amount) {
  try {
    const contractObj = await contract();
    const data = await contractObj.swapTokenToToken(
      srcToken,
      destToken,
      toWei(amount)
    );

    const receipt = await data.wait();
    return receipt;
  } catch (e) {
    return parseErrorMsg(e);
  }
}

export async function getTokenBalance(tokenName, address) {
  const contractObj = await contract();
  const balance = contractObj.getBalance(tokenName, address);
  return balance;
}

export async function getTokenAddress(tokenName) {
  try {
    const contractObj = await contract();
    const address = await contractObj.getTokenAddress(tokenName);
    return address;
  } catch (e) {
    return parseErrorMsg(e);
  }
}

export async function increaseAllowance(tokenName, amount) {
  try {
    const contractObj = await contract();
    const address = await contractObj.getTokenAddress(tokenName);
    console.log(contractObj, "<<< contract???");

    const tokenContractObj = await tokenContract(address);
    const data = await tokenContractObj.approve(
      "0x6facf2fB7d6A12B0Ae49f96Fd2c98224E9426726",
      toWei(amount)
    );

    const receipt = await data.wait();
    console.log(receipt, "????");
    return receipt;
  } catch (e) {
    console.log(e, "<<<< e");
    return parseErrorMsg(e);
  }
}

function toWei(amount) {
  const toWei = ethers.utils.parseUnits(amount.toString());
  return toWei.toString();
}

function parseErrorMsg(e) {
  const json = JSON.parse(JSON.stringify(e));
  return json?.reason || json?.error?.message;
}
