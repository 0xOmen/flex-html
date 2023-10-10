import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"
import { erc20_abi } from "./erc20-abi.js"

const connectButton = document.getElementById("connectButton")
const chainlinkButton = document.getElementById("chainlinkButton")
const chainlinkModal = document.getElementById("chainlinkModal")
const chainlinkBack = document.getElementById("chainlinkBack")
const specificButton = document.getElementById("specificButton")
const anyoneButton = document.getElementById("anyoneButton")
const takerField = document.getElementById("taker")
const nextButton = document.getElementById("nextButton")
const detailsModal = document.getElementById("detailsModal")
const chainlinkDetailsBack = document.getElementById("chainlinkDetailsBack")
const betline = document.getElementById("betline")
const nextButtonDetails = document.getElementById("nextButtonDetails")
const skinTokenModal = document.getElementById("skinTokenModal")
const detailsBack = document.getElementById("detailsBack")
const makeBetButton = document.getElementById("makeBet")

chainlinkButton.onclick = openChainlinkModal
chainlinkBack.onclick = closeChainlinkModal
nextButton.onclick = openDetailsModal
chainlinkDetailsBack.onclick = closeDetailsModal
nextButtonDetails.onclick = openSkintokenModal
detailsBack.onclick = closeSkintokenModal
makeBetButton.onclick = makeBet

let oracleType

takerField.disabled = false
specificButton.onclick = () => {
    takerField.disabled = false
}
anyoneButton.onclick = () => {
    takerField.disabled = true
    takerField.innerHTML = ""
}

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

        fetch("tokenList.json")
            .then(function (response) {
                return response.json()
            })
            .then(async function (tokens) {
                let placeholder = document.querySelector("#data-output")
                let out = ""
                for (let token of tokens) {
                    const availableBalance = await getBalance(
                        token.address,
                        token.decimals
                    )
                    if (availableBalance != 0) {
                        out += `
                    <tr>
                        <td style="vertical-align:middle"><img src=${token.img} width="25" height="25" ></img>  ${token.ticker}</td>
                        <td id="availableBalance${token.address}">${availableBalance}</td>
                    </tr>
                    `
                    }
                }
                placeholder.innerHTML = out
            })
    } else {
        console.log("Metamask is not connected")
    }
}

function openChainlinkModal() {
    console.log("Chainlink Clicked")
    chainlinkModal.classList.remove("hidden")
    oracleType = "chainlink"
}

function closeChainlinkModal() {
    chainlinkModal.classList.add("hidden")
}

function openDetailsModal() {
    if (priceline.value) {
        detailsModal.classList.remove("hidden")
    }
}

function closeDetailsModal() {
    detailsModal.classList.add("hidden")
}

function openSkintokenModal() {
    skinTokenModal.classList.remove("hidden")
}

function closeSkintokenModal() {
    skinTokenModal.classList.add("hidden")
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
            return availableTokensField
        } catch (error) {
            console.log(error)
        }
    }
}

async function makeBet() {
    let oracleTypeEnum
    let uniFeePool
    let oracleAddressMain, oracleAddressTwo
    if (oracleType === "chainlink") {
        oracleTypeEnum = 0
        oracleAddressMain = document.getElementById("chainlinkFeed").value
        if (oracleAddressMain.length > 42) {
            oracleAddressTwo = oracleAddressMain.substring(42, 84)
            oracleAddressMain = oracleAddressMain.substring(0, 42)
            console.log(oracleAddressTwo)
        } else {
            oracleAddressTwo = "0x0000000000000000000000000000000000000000"
        }
        uniFeePool = 3000
    } else if (oracleType === "uniswapButton") {
        oracleTypeEnum = 1
        /*const oracleAddressMain = document.getElementById("chainlinkFeed").value
        const oracleAddressTwo =
            document.getElementById("oracleAddressTwo").value*/
    }
    console.log(`Main oracle: ${oracleAddressMain}`)
    console.log(`Main oracle: ${oracleAddressTwo}`)
    const skinTokenAddress = document.getElementById("skinToken").value
    const betAmount = document.getElementById("skinTokenAmount").value
    let takerAddress = document.getElementById("taker").value
    console.log(`Taker Address: ${takerAddress}`)
    if (takerAddress === "") {
        takerAddress = "0x0000000000000000000000000000000000000000"
    }
    console.log(`Taker Address: ${takerAddress}`)
    const timeAmount = document.getElementById("timeAmount").value
    const timeUnits = document.getElementById("timeUnits").value
    let time
    if (timeUnits === "hours") {
        time = timeAmount * 3600
    } else if (timeUnits === "days") {
        time = timeAmount * 86400
    } else if (timeUnits === "years") {
        time = timeAmount * 31536000
    } else {
        time = timeAmount
    }
    const priceline = document.getElementById("priceline").value
    const comparator = document.getElementById("comparator").value
    let comparatorEnum
    if (comparator === "greaterThan") {
        comparatorEnum = 0
    } else if (comparator === "equal") {
        comparatorEnum = 1
    } else if (comparator === "lessThan") comparatorEnum = 2

    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const tokenDecimals = await new ethers.Contract(
            skinTokenAddress,
            erc20_abi,
            signer
        ).decimals()
        //convert from human readable to bigNumber
        const bigNumberAmount = ethers.utils.parseUnits(
            betAmount,
            tokenDecimals
        )
        console.log(`Betting ${betAmount} of ${skinTokenAddress}`)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const newBetTx = await contract.betWithUserBalance(
                takerAddress,
                skinTokenAddress,
                bigNumberAmount,
                time,
                oracleAddressMain,
                oracleAddressTwo,
                oracleTypeEnum,
                uniFeePool,
                priceline,
                comparatorEnum
            )
            await newBetTx.wait()
        } catch (error) {
            console.log(error)
        }
    }
}
