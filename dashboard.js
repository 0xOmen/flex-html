import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const tableData = document.getElementById("data-output")
const closeBetNumberButton = document.getElementById("closeBetNumberButton")
const acceptBetNumberButton = document.getElementById("acceptBetNumberButton")
const acceptBetButton = document.getElementById("acceptBetButton")
const lookupBetButton = document.getElementById("lookupBetNumberButton")
const modal = document.querySelector(".modal")
const closeModalBtn = document.querySelector(".btn-close")

connectButton.onclick = connect
closeBetNumberButton.onclick = closeBet
acceptBetNumberButton.onclick = acceptBet
acceptBetButton.onclick = acceptBetLookup
lookupBetButton.onclick = openLookupModal
closeModalBtn.addEventListener("click", closeModal)

window.onload = (event) => {
    isConnected()
}

async function isConnected() {
    const accounts = await ethereum.request({ method: "eth_accounts" })
    if (accounts.length) {
        console.log(`You're connected to: ${accounts[0]}`)
        connectButton.innerHTML = `${accounts[0].substring(
            0,
            6,
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
            6,
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
            const userBets = await contract.getUserBets(userAddress)
            for (let bets in userBets) {
                const betDetails = await contract.AllBets(userBets[bets])
                if (
                    betDetails[0][0] == userAddress ||
                    betDetails[0][1] == userAddress
                ) {
                    betOutput += getBetData(
                        userBets[bets],
                        betDetails,
                        userAddress,
                    )
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
        counterParty = " Anyone "
    }
    if (betDetails[3] == 0) {
        status = "Waiting for Taker"
        outcome = "Pending..."
    } else if (betDetails[3] == 1) {
        status = "Killed"
        outcome = "Funds returned"
    } else if (betDetails[3] == 2) {
        if (betDetails[2].toNumber() < Math.floor(Date.now() / 1000)) {
            status = "Ready to Close"
            outcome = "Awaiting Close Transaction"
        } else {
            const date = new Date(
                betDetails[2].toNumber() * 1000,
            ).toLocaleString()
            status = `Closes ${date}`
            outcome = "Pending..."
        }
    } else if (betDetails[3] == 3) {
        status = "Finished"
        if (betDetails[0][0] == userAddress) outcome = "Flex on 'em, You won!"
        else outcome = "Flex harder, You did not win"
    } else if (betDetails[3] == 4) {
        status = "Finished"
        if (betDetails[0][1] == userAddress) outcome = "Flex on 'em, You won!"
        else outcome = "Flex harder, You did not win"
    } else if (betDetails[3] == 5) {
        status = "Mutually Killed"
        outcome = "Funds returned"
    }

    const answer = `<tr>
            <td style="text-align: center"> ${betNum} </td>
            <td style="text-align: center"> ${status} </td>
            <td style="text-align: center; padding-right: 5px; padding-left: 5px">  ${counterParty}  </td>
            <td style="text-align: center"> ${outcome} </td>
        </tr>`
    return answer
}

async function closeBet() {
    const betNumber = document.getElementById("closeBetNumber").value
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(`Closing bet number:  ${betNumber}`)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const closeBetTx = await contract.closeBet(betNumber)
            console.log(closeBetTx)
        } catch (error) {
            console.log(error)
        }
    }
}

async function acceptBet() {
    const betNumber = document.getElementById("acceptBetNumber").value
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        console.log(`Accpeting bet ${betNumber}`)
        try {
            const acceptBetTx =
                await contract.acceptBetWithUserBalance(betNumber)
            await acceptBetTx.wait()
        } catch (error) {
            console.log(error)
        }
    }
}

async function acceptBetLookup() {
    const betNumber = document.getElementById("lookupBetNumber").value
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        console.log(`Accpeting bet ${betNumber}`)
        try {
            const acceptBetTx =
                await contract.acceptBetWithUserBalance(betNumber)
            await acceptBetTx.wait()
        } catch (error) {
            console.log(error)
        }
    }
}

function openLookupModal() {
    modal.classList.remove("hidden")
    lookupBet()
}

function closeModal() {
    modal.classList.add("hidden")
}

async function lookupBet() {
    const betNumber = document.getElementById("lookupBetNumber").value
    const betQueryResults = document.getElementById("betLookupResults")
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)

        try {
            const queryBet = await contract.AllBets(betNumber)
            let oracleToken
            let comparator
            let taker
            let collateral
            let decimals
            let amount
            if (
                queryBet[0][3] == "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
            ) {
                oracleToken = `ETH`
            } else if (
                queryBet[0][3] == "0xA39434A63A52E749F02807ae27335515BA4b07F7"
            ) {
                oracleToken = `BTC`
            } else if (
                queryBet[0][3] == "0x48731cF7e84dc94C5f84577882c14Be11a5B7456"
            ) {
                oracleToken = `LINK`
            } else if (
                queryBet[0][3] == "0x779877A7B0D9E8603169DdbD7836e478b4624789"
            ) {
                oracleToken = `BTC/ETH`
            } else if (
                queryBet[0][3] ==
                    "0xB677bfBc9B09a3469695f40477d05bc9BcB15F50" &&
                queryBet[0][4] == "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e"
            ) {
                oracleToken = "BAYC Floor Price"
            }
            fetch("tokenList.json")
                .then(function (response) {
                    return response.json()
                })
                .then(async function (tokens) {
                    for (let token of tokens) {
                        if (queryBet[0][2] == token.address) {
                            collateral = token.ticker
                            decimals = token.decimals
                        }
                    }
                })

            if (oracleToken == 0) oracleToken = `${queryBet[0][3]}`

            if (queryBet[7] == 0) comparator = ">"
            else if (queryBet[7] == 1) comparator = "="
            else comparator = "<"
            if (queryBet[3] == 0) {
                if (
                    queryBet[0][1] ==
                    "0x0000000000000000000000000000000000000000"
                ) {
                    amount = ethers.utils.formatUnits(queryBet[1], decimals)
                    taker = `Anyone can take the bet for ${amount} collateral token ${queryBet[0][2]}`
                } else taker = `Only ${queryBet[0][1]} can take the bet`
            } else taker = `Bet taken by ${queryBet[0][1]}`
            betQueryResults.innerHTML = `Address ${queryBet[0][0]} bet ${oracleToken} will be ${comparator} $ ${queryBet[6]} \n${taker}`
            console.log(queryBet)
        } catch (error) {
            console.log(error)
        }
    }
}
