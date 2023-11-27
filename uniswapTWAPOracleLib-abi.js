export const uniContractAddress = "0xDC4BA11C0Cd22A10CC468A42FFB58cF0540C36cB"
export const uni_abi = [
    {
        inputs: [
            { internalType: "address", name: "_factory", type: "address" },
            { internalType: "address", name: "_token0", type: "address" },
            { internalType: "address", name: "_token1", type: "address" },
            { internalType: "uint24", name: "_fee", type: "uint24" },
            { internalType: "uint32", name: "_twapInterval", type: "uint32" },
            { internalType: "uint8", name: "_token0Decimals", type: "uint8" },
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
            { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
        ],
        name: "getPriceX96FromSqrtPriceX96",
        outputs: [
            { internalType: "uint256", name: "priceX96", type: "uint256" },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "uniswapV3Pool", type: "address" },
            { internalType: "uint32", name: "twapInterval", type: "uint32" },
        ],
        name: "getSqrtTwapX96",
        outputs: [
            { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
        ],
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
]
