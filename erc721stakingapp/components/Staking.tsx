'use client';

import { chain } from "@/app/chain";
import { client } from "@/app/client";
import { ConnectButton, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { claimTo, getNFTs, ownerOf, totalSupply } from "thirdweb/extensions/erc721";
import { NFT_CONTRACT, STAKING_CONTRACT } from "@/utils/contracts";
import { useEffect, useState } from "react";
import { NFT } from "thirdweb";
import { NFTCard } from "./NFTCard";
import { StakeNFTCard } from "@/components/StakedNFTCard";
import { StakeRewards } from "./StakeRewards";
export const Staking = () => {
    const account = useActiveAccount();

    const [ownedNFTs, setOwnedNFTs] = useState<NFT[]>([]);

    const getOwnedNFTs = async () => {
        let ownedNFTs: NFT[] = [];

        const totalNFTSupply = await totalSupply({
            contract: NFT_CONTRACT,
        });
        const nfts = await getNFTs({
            contract: NFT_CONTRACT,
            start: 0,
            count: parseInt(totalNFTSupply.toString()),
        });

        for (let nft of nfts) {
            const owner = await ownerOf({
                contract: NFT_CONTRACT,
                tokenId: nft.id
            })

            if (owner === account?.address) {
                ownedNFTs.push(nft);
            }
        }
        setOwnedNFTs(ownedNFTs)
    }

    useEffect(() => {
        if (account) {
            getOwnedNFTs();
        }
    }, [account]);

    const {
        data: stakeInfo,
        refetch: refecthStakedInfo
    } = useReadContract({
        contract: STAKING_CONTRACT,
        method: "getStakeInfo",
        params: [account?.address || ""]

    })
    if (account) {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#151515",
                borderRadius: "8px",
                width: "500px",
                padding: "20px",
            }}>
                <ConnectButton
                    client={client}
                    chain={chain}
                />

                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: "20px 0",
                    width: "100%"
                }}>
                    <h2 style={{ marginRight: "20px" }}> Claim NFT to Stake</h2>

                    <TransactionButton
                        transaction={() => (
                            claimTo({
                                contract: NFT_CONTRACT,
                                to: account?.address || "",
                                quantity: BigInt(1)
                            })
                        )}
                        onTransactionConfirmed={() => {
                            alert("NFT claimed!");
                            getOwnedNFTs();
                        }}
                        style={{
                            fontSize: "12px",
                            backgroundColor: "#333",
                            color: "#fff",
                            padding: "10px 20px",
                            borderRadius: "10px",
                        }}
                    >Claim NFT</TransactionButton>
                </div>
                <hr style={{
                    width: "100%",
                    border: "1px solid #333"
                }} />
                <div style={{
                    margin: "20px 0",
                    width: "100%"
                }}>
                    <h2>Owned NFTs</h2>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        width: "500px"
                    }}>
                        {
                            ownedNFTs && ownedNFTs.length > 0 ? (
                                ownedNFTs.map((nft) => (
                                    <NFTCard
                                        key={nft.id}
                                        nft={nft}
                                        refetchOwnedNFTs={getOwnedNFTs}
                                        refecthStakedInfo={refecthStakedInfo}
                                    />
                                ))
                            ) : (
                                <p>You own 0 NFTs</p>
                            )
                        }
                    </div>
                </div>
                <div>
                    <hr style={{
                        width: "100%",
                        border: "1px solid #333"
                    }} />
                    <div style={{
                        width: "100%",
                        margin: "20px 0"
                    }}>
                        <h2>Staked NFTs</h2>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            width: "500px"
                        }}>
                            {stakeInfo && stakeInfo[0].length > 0 ? (
                                stakeInfo[0].map((tokenId: bigint) => (
                                    <StakeNFTCard
                                        key={tokenId}
                                        tokenId={tokenId}
                                        refetchStakedInfo={refecthStakedInfo}
                                        refetchOwnedNFTs={getOwnedNFTs}
                                    />
                                ))
                            ) : (
                                <p>You have 0 staked NFTs</p>
                            )}
                        </div>
                    </div>
                    <hr style={{
                        width: "100%",
                        border: "1px solid #333"
                    }}/>
                    <StakeRewards/>
                </div>
            </div>
        )
    }
}