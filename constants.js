export const contractAddress = "0x0b6Ee1185559dD97E5BFe91996dB4b51de850EaE"
export const abi = [
    {
        inputs: [
            { internalType: "uint8", name: "_protocolFee", type: "uint8" },
            {
                internalType: "address",
                name: "_UNISWAP_TWAP_LIBRARY",
                type: "address",
            },
            { internalType: "address", name: "_UNIV3FACTORY", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [{ internalType: "address", name: "target", type: "address" }],
        name: "AddressEmptyCode",
        type: "error",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "AddressInsufficientBalance",
        type: "error",
    },
    { inputs: [], name: "FailedInnerCall", type: "error" },
    {
        inputs: [{ internalType: "address", name: "owner", type: "address" }],
        name: "OwnableInvalidOwner",
        type: "error",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "OwnableUnauthorizedAccount",
        type: "error",
    },
    {
        inputs: [{ internalType: "address", name: "token", type: "address" }],
        name: "SafeERC20FailedOperation",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "maker",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "taker",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "betNumber",
                type: "uint256",
            },
        ],
        name: "attemptBetCancelByMaker",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "maker",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "taker",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "betNumber",
                type: "uint256",
            },
        ],
        name: "attemptBetCancelByTaker",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "betNumber",
                type: "uint256",
            },
        ],
        name: "betCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "maker",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "taker",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "betNumber",
                type: "uint256",
            },
        ],
        name: "betCompleted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "maker",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "taker",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "betNumber",
                type: "uint256",
            },
        ],
        name: "betCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "betNumber",
                type: "uint256",
            },
        ],
        name: "betKilled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "uint256",
                name: "betNumber",
                type: "uint256",
            },
        ],
        name: "betTaken",
        type: "event",
    },
    {
        inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        name: "AllBets",
        outputs: [
            {
                components: [
                    { internalType: "address", name: "Maker", type: "address" },
                    { internalType: "address", name: "Taker", type: "address" },
                    {
                        internalType: "address",
                        name: "CollateralToken",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "OracleAddressMain",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "OracleAddress2",
                        type: "address",
                    },
                ],
                internalType: "struct Flex.BetAddresses",
                name: "betAddresses",
                type: "tuple",
            },
            { internalType: "uint256", name: "BetAmount", type: "uint256" },
            { internalType: "uint256", name: "EndTime", type: "uint256" },
            {
                internalType: "enum Flex.Status",
                name: "BetStatus",
                type: "uint8",
            },
            {
                internalType: "enum Flex.OracleType",
                name: "OracleName",
                type: "uint8",
            },
            { internalType: "uint24", name: "UniswapFeePool", type: "uint24" },
            { internalType: "uint256", name: "PriceLine", type: "uint256" },
            {
                internalType: "enum Flex.Comparison",
                name: "Comparator",
                type: "uint8",
            },
            { internalType: "bool", name: "MakerCancel", type: "bool" },
            { internalType: "bool", name: "TakerCancel", type: "bool" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "BetNumber",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "uint256", name: "", type: "uint256" },
        ],
        name: "UserBets",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_betNumber", type: "uint256" },
        ],
        name: "acceptBetWithUserBalance",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "address", name: "", type: "address" },
        ],
        name: "balances",
        outputs: [
            {
                internalType: "uint256",
                name: "depositedBalance",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "escrowedBalance",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_takerAddress", type: "address" },
            {
                internalType: "address",
                name: "_collateralTokenAddress",
                type: "address",
            },
            { internalType: "uint256", name: "_amount", type: "uint256" },
            { internalType: "uint32", name: "_time", type: "uint32" },
            {
                internalType: "address",
                name: "_oracleAddressMain",
                type: "address",
            },
            {
                internalType: "address",
                name: "_oracleAddress2",
                type: "address",
            },
            {
                internalType: "enum Flex.OracleType",
                name: "_oracleName",
                type: "uint8",
            },
            { internalType: "uint24", name: "_uniFeePool", type: "uint24" },
            { internalType: "uint256", name: "_priceLine", type: "uint256" },
            {
                internalType: "enum Flex.Comparison",
                name: "_comparator",
                type: "uint8",
            },
        ],
        name: "betWithUserBalance",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_betNumber", type: "uint256" },
        ],
        name: "cancelBet",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint8", name: "_newProtocolFee", type: "uint8" },
        ],
        name: "changeProtocolFee",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_betNumber", type: "uint256" },
        ],
        name: "checkClosable",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        name: "checkUpkeep",
        outputs: [
            { internalType: "bool", name: "upkeepNeeded", type: "bool" },
            { internalType: "bytes", name: "performData", type: "bytes" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_betNumber", type: "uint256" },
        ],
        name: "closeBet",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_tokenAddress", type: "address" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "depositTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_oracleAddress",
                type: "address",
            },
        ],
        name: "getChainlinkPrice",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_oracleAddress",
                type: "address",
            },
        ],
        name: "getDecimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_betNumber", type: "uint256" },
        ],
        name: "getOraclePriceByBet",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_userAddress", type: "address" },
        ],
        name: "getUserBets",
        outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "performData", type: "bytes" }],
        name: "performUpkeep",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_betNumber", type: "uint256" },
        ],
        name: "requestBetCancel",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_UniLibAddr", type: "address" },
        ],
        name: "setUniswapOracleLibrary",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_tokenAddress", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferERC20",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "newOwner", type: "address" },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "twapGetter",
        outputs: [
            {
                internalType: "contract UniV3TwapOracleInterface",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_tokenAddress", type: "address" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "userWithdrawTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "withdrawEther",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
]
