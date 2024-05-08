import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { getContract } from "thirdweb";
import { STAKING_CONTRACT_ABI } from "./stakingContractABI";

const nftContractAddress = "0x9AaDf42E9Dc3deb30c40F40F738Ab40C5FFB916c";
const rewardTokenContractAddress = "0xbBBe3763b1f274aE56e2aBa121c55F6614a58b38";
const stakingContractAddress = "0xc109281bE466bd84B3F35d121d3892063a31fD0b";

export const NFT_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: nftContractAddress,
})

export const REWARD_TOKEN_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: rewardTokenContractAddress,
})

export const STAKING_CONTRACT = getContract({
    client: client,
    chain: chain,
    address: stakingContractAddress,
    abi: STAKING_CONTRACT_ABI
})