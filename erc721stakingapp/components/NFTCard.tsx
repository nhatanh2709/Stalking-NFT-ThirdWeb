import { client } from "@/app/client";
import { NFT_CONTRACT, STAKING_CONTRACT } from "@/utils/contracts";
import { useState } from "react";
import {NFT, prepareContractCall} from "thirdweb";
import { approve } from "thirdweb/extensions/erc721";
import { MediaRenderer, TransactionButton } from "thirdweb/react";

type OwnedNFTsProps = {
    nft: NFT;
    refetchOwnedNFTs : () => void;
    refecthStakedInfo: () => void;
}

export const NFTCard = ({nft, refetchOwnedNFTs, refecthStakedInfo} : OwnedNFTsProps) => {
    const [isModalOpen, setIsModelOpen] = useState(false);
    const [isApproved, setIsApproved] = useState(false);

    return (
        <div style={{margin: "10px"}}>
            <MediaRenderer
                client={client}
                src={nft.metadata.image}
                style={{
                    borderRadius: "10px",
                    marginBottom: "10px",
                    height: "200px",
                    width: "200px"
                }}
            />

            <p style={{margin: "0 10px 10px 10px"}}>{nft.metadata.name}</p>
            <button
                onClick={() => setIsModelOpen(true)}
                style={{
                    border: "none",
                    backgroundColor: "#333",
                    color: "#fff",
                    padding : "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    width: "100%"
                }}
            >
                Stake
            </button>
            {isModalOpen && (
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <div style={{
                        minWidth: "300px",
                        backgroundColor: "#222",
                        padding: "20px",
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                    }}>
                        <div style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%"
                        }}>
                            <button
                            onClick={() => setIsModelOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                        <h3 style={{ 
                            margin: "10px 0"
                        }}>You are about to stake:</h3>
                        <MediaRenderer
                            client={client}
                            src={nft.metadata.image}
                            style={{
                                borderRadius: "10px",
                                marginBottom: "10px"
                            }}
                        />
                        {!isApproved ? (
                            <TransactionButton
                                transaction={() => (
                                    approve({
                                        contract: NFT_CONTRACT,
                                        to: STAKING_CONTRACT.address,
                                        tokenId: nft.id
                                    })
                                )}
                                style={{
                                    width: "100%"
                                }}
                                onTransactionConfirmed={() => setIsApproved(true)}
                            >
                                Approve
                            </TransactionButton>
                        ) : (
                            <TransactionButton
                                transaction={() => (
                                    prepareContractCall({
                                        contract: STAKING_CONTRACT,
                                        method: "stake",
                                        params: [[nft.id]]
                                    })
                                )}
                                onTransactionConfirmed={() => {
                                    alert("Staked!")
                                    setIsModelOpen(false);
                                    refetchOwnedNFTs();
                                    refecthStakedInfo();
                                }}
                            >
                                Stake
                            </TransactionButton>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
};