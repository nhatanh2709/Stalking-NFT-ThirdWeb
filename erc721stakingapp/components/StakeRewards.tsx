import { REWARD_TOKEN_CONTRACT, STAKING_CONTRACT } from "@/utils/contracts";
import { useEffect } from "react";
import { balanceOf } from "thirdweb/extensions/erc20";
import { TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";
import { prepareContractCall, toEther } from "thirdweb";
export const StakeRewards = () => {
    const account = useActiveAccount();

    const {
        data : tokenBalance,
        isLoading: isTokenBalanceLoading,
        refetch: refetchTokenBalance,
    } = useReadContract(
        balanceOf, {
            contract: REWARD_TOKEN_CONTRACT,
            address: account?.address || ''
        }
    )

    const {
        data : stakedInfo,
        refetch : refetchStakedInfo,
    } = useReadContract({
        contract: STAKING_CONTRACT,
        method: "getStakeInfo",
        params: [account?.address || ""]
    })

    useEffect(() => {
        refetchStakedInfo();
        const interval = setInterval(() => {
            refetchStakedInfo();
        }, 1000);
        return () => clearInterval(interval);
    },[])
    return (
        <div style={{
            width: "100%",
            margin: "20px 0",
            display: "flex",
            flexDirection: "column"
        }}>
            {!isTokenBalanceLoading && (
                <p>Wallet Balance: {toEther(BigInt(tokenBalance!.toString()))}</p>
            )}
            <h2>Stake Rewards : {stakedInfo && toEther(BigInt(stakedInfo[1].toString()))}</h2>
            <TransactionButton
                transaction={() => (
                    prepareContractCall({
                        contract: STAKING_CONTRACT,
                        method: "claimRewards"
                    })
                )}
                onTransactionConfirmed={() => {
                    alert("Rewards claimed!")
                    refetchStakedInfo();
                    refetchTokenBalance();
                }}
                style={{
                    border: "none",
                    backgroundColor: "#333",
                    color: "#fff",
                    padding: "10px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    width: "100%"
                }}
            >
                Claim Rewards
            </TransactionButton>
        </div>
    )
}