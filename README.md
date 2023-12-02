A basic front end for Flex in HTML

Connect
ethers.js connection to browser wallet. So far only tested with Metamask

Get Balance
Returns the balance of the token queried for the currently connected wallet account.
Converts BigNumber to human readable number (human readable number displayed).

Fund
Deposit from the Allow List of ERC20 tokens
User inputs a human readable number. Then index.js obtains the number of decimals in
the ERC20 contract and converts the input into a BigNumber for submission to the
blockchain.

Withdraw
Withdraw a user's ERC20 token. User can designate how much to withdraw.
Reverses what 'Fund' does. User should input a human readable number.

Create Bet
User will need to input a great deal of information.  
 Uniswap
User will need to input the two tokens being compared (e.g. USDC token address and
WETH token address for WETH/USDC). User will also need to designate a Uniswap fee
pool (default is 3000 which is 0.3%).

    Chainlink
    User will need to input the chainlink oracle address for the desired pair. If using
    only one Chainlink oracle the null address should be entered for oracle2. A second
    Chainlink oracle can be entered to compare prices for tokens that do not have direct
    price oracles. The math for 2 oracles is: oracle1/oracle2. So if comparing ETH/USD
    oracle1should be: 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e (ETH/USD oracle) and
    oracle2 should be: 0x0000000000000000000000000000000000000000 (null address). If
    comparing two oracles e.g. SNX/ETH enter the SNX/USD address for oracle1:
    0xdC5f59e61e51b90264b38F0202156F07956E2577 (SNX/USD) and the ETH/USD oracle address
    for oracle2 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e.  This will yield SNX/ETH.

    Other info
    Time is the number of seconds from when the bet creation transaction is mined until the bet is decided. Priceline is the price at which the bet is decided.  Comparator determines if priceline should be greater than, less than, or equal to the oracle price for the Maker to win.  Collateral Token is the token with which the bet will be settled and Bet Amount is how many tokens the bet is for.  Lastly, Taker address can be used to assign a single address/person who can take the bet or this can be set to the Ethereum null address in which case anyone except the Maker can take the bet.

    Example: ETH/USD Chainlink single oracle
    The Maker wants to bet 1000 USDC that ETH will be > $2000 in 3 months and anyone can take the bet.  They want to use a Chainlink oralce.
    oracle = select Chainlink radiobutton
    skinTokenAddress = USDC token address
    betAmount = 1000
    oracleAddressMain = 0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e (Goerli ETH/USD oracle)
    oracleAddressTwo = 0x0000000000000000000000000000000000000000
    takerAddress = 0x0000000000000000000000000000000000000000
    time = 7776000 (seconds in 90 days)
    uniFeePool = not used
    priceline = 2000
    comparator = '>' (greater than)

    Example: WETH/USD Uniswap oracle
    The Maker wants to bet 1000 USDC that ETH will be < $150 in 3 months. Only a specific user can take the bet.  They want to use a Uniswap oralce.
    oracle = select Uniswap radiobutton
    skinTokenAddress = USDC token address
    betAmount = 1000
    oracleAddressMain =  0x07865c6e87b9f70255377e024ace6630c1eaa37f (Goerli USDC address)
    oracleAddressTwo = 0x08Ff27EDD8CC750d2EE8A44105B3CE6dB2963a5c (Goerli WETH address)
    takerAddress = 0xd8da6bf26964af9d7eed9e03e53415d37aa96045 (Vitalik's address)
    time = 7776000 (seconds in 90 days)
    uniFeePool = 3000 (to use the 0.3% swap fee pool)
    priceline = 150
    comparator = < (less than)

Accept Bet
User will need to input the bet number they wish to accept. User will need to have the correct amount of tokens already deposited in the protocol.

Close Bet
Anyone can enter a bet number to close that bet assuming all criteria are met. Generally bets will be closed by Chainlink Automation.

Get Chainlink Price
Enter the address of chainlink oracle you wish to query. It will return the most recent value in human readable format
