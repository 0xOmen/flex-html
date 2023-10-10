//import ethers from "front end file"
import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"
import { erc20_abi } from "./erc20-abi.js"
import { uniContractAddress, uni_abi } from "./uniswapTWAPOracleLib-abi.js"

const connectButton = document.getElementById("connectButton")
const chainlinkOracleButton = document.getElementById("chainlinkOracleButton")
const killBetNumberButton = document.getElementById("killBetNumberButton")
const betNumberQueryButton = document.getElementById("betNumberQueryButton")
const acceptBetNumberButton = document.getElementById("acceptBetNumberButton")
const closeBetNumberButton = document.getElementById("closeBetNumberButton")
const cancelBetNumberButton = document.getElementById("cancelBetNumberButton")
const uniswapOracleButton = document.getElementById("uniswapOracleButton")
const changeUniLibraryButton = document.getElementById("changeUniLibraryButton")

connectButton.onclick = connect
chainlinkOracleButton.onclick = chainlinkOracle
killBetNumberButton.onclick = makerCancelBet
betNumberQueryButton.onclick = queryBet
acceptBetNumberButton.onclick = acceptBet
closeBetNumberButton.onclick = closeBet
cancelBetNumberButton.onclick = usersCancelBet
uniswapOracleButton.onclick = uniswapPrice
changeUniLibraryButton.onclick = changeUniLibrary

async function connect() {
    if (typeof window.ethereum != undefined) {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const userAddress = await signer.getAddress()
        const accountConnected = `${userAddress} Connected`
        connectButton.innerHTML = accountConnected
        console.log("Metamask connected")
    } else {
        connectButton.innerHTML = "Metamask not found"
    }
}

async function getBalance() {
    const tokenAddress = document.getElementById("tokenBalanceID").value
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const userAddress = await signer.getAddress()
        console.log(`Checking user balances...`)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const balances = await contract.balances(userAddress, tokenAddress)
            const availableTokensField = document.getElementById(
                "availableTokensField"
            )
            const escrowedTokensField = document.getElementById(
                "escrowedTokensField"
            )
            const tokenDecimals = await new ethers.Contract(
                tokenAddress,
                erc20_abi,
                signer
            ).decimals()
            availableTokensField.innerHTML = ethers.utils.formatUnits(
                (balances[0] - balances[1]).toString(),
                tokenDecimals
            )
            escrowedTokensField.innerHTML = ethers.utils.formatUnits(
                balances[1].toString(),
                tokenDecimals
            )
        } catch (error) {
            console.log(error)
        }
    }
}

async function fundTokens() {
    const amount = document.getElementById("depositAmount").value
    const tokenAddress = document.getElementById("depositTokenAddress").value
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

async function createNewBet() {
    const oracleType = document.querySelector(
        'input[name="oracleType"]:checked'
    ).value
    let oracleTypeEnum
    if (oracleType === "chainlinkButton") {
        oracleTypeEnum = 0
    } else if (oracleType === "uniswapButton") oracleTypeEnum = 1
    const skinTokenAddress = document.getElementById("skintokenAddress").value
    const betAmount = document.getElementById("betAmount").value
    const oracleAddressMain = document.getElementById("oracleAddressMain").value
    const oracleAddressTwo = document.getElementById("oracleAddressTwo").value
    const takerAddress = document.getElementById("takerAddress").value
    const time = document.getElementById("time").value
    const uniFeePool = document.getElementById("uniFeePool").value
    const priceline = document.getElementById("priceline").value
    const comparator = document.getElementById("comparator").value
    let comparatorEnum
    if (comparator === ">") {
        comparatorEnum = 0
    } else if (comparator === "=") {
        comparatorEnum = 1
    } else if (comparator === "<") comparatorEnum = 2

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

async function chainlinkOracle() {
    const oracleAddress = document.getElementById("chainlinkOracle").value
    const currentPrice = document.getElementById("chainlinkPrice")
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(`checking most recent Price from  ${oracleAddress}`)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const oracleCheck = await contract.getChainlinkPrice(oracleAddress)
            console.log(oracleCheck.toNumber())
            currentPrice.innerHTML = `Current round price: ${oracleCheck.toNumber()}`
        } catch (error) {
            console.log(error)
        }
    }
}

async function makerCancelBet() {
    const betNumberKill = document.getElementById("betNumberKill").value
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(`Trying to cancel bet number:  ${betNumberKill}`)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const attemptCancelTx = await contract.cancelBet(betNumberKill)
            console.log(attemptCancelTx)
        } catch (error) {
            console.log(error)
        }
    }
}

async function queryBet() {
    const betNumber = document.getElementById("betNumberQuery").value
    const betQueryResults = document.getElementById("betQueryResults")
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(`Querying bet number:  ${betNumber}`)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const queryBet = await contract.AllBets(betNumber)
            betQueryResults.innerHTML = `${queryBet[0][0]} made bet with ${queryBet[0][1]} for ${queryBet[1]} amount of token ${queryBet[0][2]} with priceline ${queryBet[6]} and status is ${queryBet[3]}`
            console.log(queryBet)
        } catch (error) {
            console.log(error)
        }
    }
}

async function acceptBet() {
    const amount = document.getElementById("acceptBetAmount").value
    const betNumber = document.getElementById("acceptBetNumber").value
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        const betData = await contract.AllBets(betNumber)
        const addresses = betData.betAddresses
        //convert amount from human readable to bignumber
        const tokenDecimals = await new ethers.Contract(
            addresses.SkinToken,
            erc20_abi,
            signer
        ).decimals()
        const bigNumberAmount = ethers.utils.parseUnits(amount, tokenDecimals)
        console.log(`Accpeting bet ${betNumber} with ${amount} tokens`)
        try {
            const acceptBetTx = await contract.acceptBetWithUserBalance(
                betNumber,
                bigNumberAmount
            )
            await acceptBetTx.wait()
        } catch (error) {
            console.log(error)
        }
    }
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

async function usersCancelBet() {
    const betNumber = document.getElementById("betNumberCancel").value
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(`Killing bet number:  ${betNumber}`)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const cancelBetTx = await contract.requestBetCancel(betNumber)
            console.log(cancelBetTx)
        } catch (error) {
            console.log(error)
        }
    }
}

async function uniswapPrice() {
    const addressOne = document.getElementById("uniswapAddressOne").value
    const addressTwo = document.getElementById("uniswapAddressTwo").value
    const feePool = document.getElementById("uniswapPoolFee").value
    const uniFactoryGoerli = "0x1F98431c8aD98523631AE4a59f267346ea31F984"
    const currentPrice = document.getElementById("uniswapPrice")
    const twapInterval = 60
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(`checking Uniswap oracle price...`)
        const uniLibContract = new ethers.Contract(
            uniContractAddress,
            uni_abi,
            signer
        )
        //const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const addressZero = await uniLibContract.getToken0(
                uniFactoryGoerli,
                addressOne,
                addressTwo,
                feePool
            )
            if (addressZero == addressOne) {
                addressOne = addressTwo
            }
            const tokenZeroDecimals = await new ethers.Contract(
                addressZero,
                erc20_abi,
                signer
            ).decimals()
            const price = await uniLibContract.convertToHumanReadable(
                uniFactoryGoerli,
                addressZero,
                addressOne,
                feePool,
                twapInterval,
                tokenZeroDecimals
            )
            console.log(price.toString())
            currentPrice.innerHTML = `1 token of ${addressOne} costs ${price.toString()} tokens of ${addressZero}`
        } catch (error) {
            console.log(error)
        }
    }
}

async function changeUniLibrary() {
    const newUniLibraryAdr = document.getElementById(
        "newUniLibraryAddress"
    ).value
    if (typeof window.ethereum != undefined) {
        //Finds node endpoint in Metamask
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(`Changing UniswapOracleLibrary...`)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const changeLibTx = await contract.setUniswapOracleLibrary(
                newUniLibraryAdr
            )
            console.log(changeLibTx)
        } catch (error) {
            console.log(error)
        }
    }
}
