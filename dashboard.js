import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"
import { erc20_abi } from "./erc20-abi.js"

const connectButton = document.getElementById("connectButton")
const tableData = document.getElementById("data-output")

connectButton.onclick = connect

window.onload = (event) => {
    isConnected()
}

async function isConnected() {
    const accounts = await ethereum.request({ method: "eth_accounts" })
    if (accounts.length) {
        console.log(`You're connected to: ${accounts[0]}`)
        connectButton.innerHTML = `${accounts[0].substring(
            0,
            6
        )}...${accounts[0].substring(38, 43)} Connected`
        populateBets()
    } else {
        console.log("Metamask is not connected")
    }
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

        populateBets()
    } else {
        connectButton.innerHTML = "Metamask not found"
    }
}

async function populateBets() {
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const userAddress = await signer.getAddress()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        let betOutput = ""
        try {
            const totalBets = await contract.BetNumber()
            for (let betNum = 1; betNum <= totalBets.toNumber(); betNum++) {
                const betDetails = await contract.AllBets(betNum)
                if (
                    betDetails[0][0] == userAddress ||
                    betDetails[0][1] == userAddress
                ) {
                    betOutput += getBetData(betNum, betDetails, userAddress)
                }
            }
            tableData.innerHTML = betOutput
        } catch (error) {
            console.log(error)
        }
    }
}

function getBetData(betNum, betDetails, userAddress) {
    let counterParty, status, outcome
    if (betDetails[0][0] == userAddress) {
        counterParty = betDetails[0][1]
    } else {
        counterParty = betDetails[0][0]
    }
    if (counterParty == "0x0000000000000000000000000000000000000000") {
        counterParty = "Anyone"
    }
    if (betDetails[3] == 0) {
        status = "Waiting for Taker"
        outcome = "Pending..."
    } else if (betDetails[3] == 1) {
        status = "Killed"
        outcome = "Funds returned"
    } else if (betDetails[3] == 2) {
        status = "Awaiting Completion"
        outcome = "Pending..."
    } else if (betDetails[3] == 3) {
        status = "Finished"
        outcome = "Logic not Currently Available"
    } else if (betDetails[3] == 4) {
        status = "Mutually Killed"
        outcome = "Funds returned"
    }

    const answer = `<tr>
            <td style="text-align: center"> ${betNum}</td>
            <td style="text-align: center">${status}</td>
            <td style="text-align: center">${counterParty}</td>
            <td style="text-align: center">${outcome}</td>
        </tr>`
    return answer
}
