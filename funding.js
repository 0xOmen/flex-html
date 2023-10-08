//import ethers from "front end file"
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"
import { erc20_abi } from "./erc20-abi.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("tokenDepositButton")
const withdrawButton = document.getElementById("tokenWithdrawalButton")
const depositButton = document.getElementById("depositButton")

const modal = document.querySelector(".modal")
const overlay = document.querySelector(".overlay")
const closeModalBtn = document.querySelector(".btn-close")

depositButton.disabled = true
connectButton.onclick = connect
fundButton.onclick = fundTokens
withdrawButton.onclick = withdrawTokens
depositButton.onclick = openModal
closeModalBtn.addEventListener("click", closeModal)

function openModal() {
    modal.classList.remove("hidden")
    overlay.classList.remove("hidden")
}

function closeModal() {
    modal.classList.add("hidden")
    overlay.classList.add("hidden")
}

async function connect() {
    if (typeof window.ethereum != undefined) {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const userAddress = await signer.getAddress()
        const accountConnected = `${userAddress.substring(
            0,
            6
        )}...${userAddress.substring(38, 43)} Connected`
        connectButton.innerHTML = accountConnected
        console.log("Metamask connected")

        fetch("tokenList.json")
            .then(function (response) {
                return response.json()
            })
            .then(async function (tokens) {
                for (let token of tokens) {
                    const balance = await getBalance(
                        token.address,
                        token.decimals
                    )
                    const availableBalance = document.getElementById(
                        `availableBalance${token.ticker}`
                    )
                    availableBalance.innerText = `${balance[0]}`
                    const escrowedBalance = document.getElementById(
                        `escrowedBalance${token.ticker}`
                    )
                    escrowedBalance.innerText = `${balance[1]}`
                }
            })
        disableButton()
    } else {
        connectButton.innerHTML = "Metamask not found"
    }
}

async function getBalance(address, decimals) {
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const userAddress = await signer.getAddress()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const balances = await contract.balances(userAddress, address)
            const availableTokensField = ethers.utils.formatUnits(
                (balances[0] - balances[1]).toString(),
                decimals
            )
            const escrowedTokensField = ethers.utils.formatUnits(
                balances[1].toString(),
                decimals
            )
            return [availableTokensField, escrowedTokensField]
        } catch (error) {
            console.log(error)
        }
    }
}

const disableButton = () => {
    depositButton.disabled = false
}

async function fundTokens() {
    const amount = document.getElementById("depositAmount").value
    const tokenAddress = document.getElementById("tokens").value
    console.log(`Checking erc20 allowance of ${tokenAddress}`)
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const tokenDecimals = await new ethers.Contract(
            tokenAddress,
            erc20_abi,
            signer
        ).decimals()
        const bigNumberAmount = ethers.utils.parseUnits(amount, tokenDecimals)
        console.log(`bignumber = ${bigNumberAmount}`)
        console.log(signer)
        try {
            await checkAndSetAllowance(
                signer,
                tokenAddress,
                contractAddress,
                bigNumberAmount
            )
            console.log("Approval check completed")
        } catch (error) {
            console.log(error)
        }
        console.log(`Depositing ${amount} of ${tokenAddress}`)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const depositTx = await contract.depositTokens(
                tokenAddress,
                bigNumberAmount
            )
            await depositTx.wait()
        } catch (error) {
            console.log(error)
        }
    }
}

// Fetch the current allowance and update if needed
async function checkAndSetAllowance(
    wallet,
    tokenAddress,
    approvalAddress,
    amount
) {
    // Transactions with the native token don't need approval
    if (tokenAddress === ethers.constants.AddressZero) {
        return
    }

    const erc20 = new ethers.Contract(tokenAddress, erc20_abi, wallet)
    //check the erc20 allowance on our smart contract
    const allowance = await erc20.allowance(
        await wallet.getAddress(),
        approvalAddress
    )
    if (allowance.lt(amount)) {
        const approveTx = await erc20.approve(approvalAddress, amount, {
            gasPrice: await wallet.provider.getGasPrice(),
        })
        try {
            await approveTx.wait()
            console.log(`Transaction mined succesfully: ${approveTx.hash}`)
        } catch (error) {
            console.log(`Transaction failed with error: ${error}`)
        }
    }
}

async function withdrawTokens() {
    const amount = document.getElementById("withdrawAmount").value
    const tokenAddress = document.getElementById("withdrawTokenAddress").value
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const tokenDecimals = await new ethers.Contract(
            tokenAddress,
            erc20_abi,
            signer
        ).decimals()
        const bigNumberAmount = ethers.utils.parseUnits(amount, tokenDecimals)
        console.log(`Withdrawing ${amount} of ${tokenAddress}`)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const withdrawTx = await contract.userWithdrawTokens(
                tokenAddress,
                bigNumberAmount
            )
            await withdrawTx.wait()
        } catch (error) {
            console.log(error)
        }
    }
}
