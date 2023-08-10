export const uniContractAddress = "0x20ad155ea921FeDb706126f7BdC18007fA55A4ff"
export const uni_abi = [
    {
        inputs: [{ internalType: "int24", name: "_tick", type: "int24" }],
        name: "convertTickToSqrtPriceX96",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_factory", type: "address" },
            { internalType: "address", name: "_token0", type: "address" },
            { internalType: "address", name: "_token1", type: "address" },
            { internalType: "uint24", name: "_fee", type: "uint24" },
            { internalType: "uint32", name: "_twapInterval", type: "uint32" },
            { internalType: "uint8", name: "_token1Decimals", type: "uint8" },
        ],
        name: "convertToHumanReadable",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_factory", type: "address" },
            { internalType: "address", name: "_tokenA", type: "address" },
            { internalType: "address", name: "_tokenB", type: "address" },
            { internalType: "uint24", name: "_fee", type: "uint24" },
        ],
        name: "getPoolAddress",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_factory", type: "address" },
            { internalType: "address", name: "_tokenA", type: "address" },
            { internalType: "address", name: "_tokenB", type: "address" },
            { internalType: "uint24", name: "_fee", type: "uint24" },
        ],
        name: "getToken0",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_poolAddress", type: "address" },
        ],
        name: "getToken0FromPool",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_factory", type: "address" },
            { internalType: "address", name: "_token0", type: "address" },
            { internalType: "address", name: "_token1", type: "address" },
            { internalType: "uint24", name: "_fee", type: "uint24" },
            { internalType: "uint32", name: "_twapInterval", type: "uint32" },
        ],
        name: "getTwap",
        outputs: [{ internalType: "int24", name: "", type: "int24" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "sqrtPriceX96", type: "uint256" },
            { internalType: "uint8", name: "decimalsToken1", type: "uint8" },
        ],
        name: "sqrtPriceX96ToUint",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "pure",
        type: "function",
    },
]
