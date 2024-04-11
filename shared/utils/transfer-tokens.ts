// Import necessary modules and data
import { getContractCustomABI } from "@shared/web3";
import { getProviderRpcUrl, getRouterConfig, getMessageState } from "./config";
import routerAbi from "./abi/Router.json";
import offRampAbi from "./abi/OffRamp.json";
import erc20Abi from "./abi/IERC20Metadata.json";
import { ethers } from "ethers";

// Command: node src/transfer-tokens.js sourceChain destinationChain destinationAccount tokenAddress amount feeTokenAddress(optional)
// Examples(sepolia):

// pay fees with native token: node src/transfer-tokens.js ethereumSepolia avalancheFuji 0x9d087fC03ae39b088326b67fA3C788236645b717 0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05 100
// pay fees with transferToken: node src/transfer-tokens.js ethereumSepolia avalancheFuji 0x9d087fC03ae39b088326b67fA3C788236645b717 0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05 100 0x779877A7B0D9E8603169DdbD7836e478b4624789
// pay fees with a wrapped native token: node src/transfer-tokens.js ethereumSepolia avalancheFuji 0x9d087fC03ae39b088326b67fA3C788236645b717 0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05 100 0x097D90c9d3E0B50Ca60e1ae45F6A81010f9FB534

export const transferTokens = async ({
  sourceChain,
  destinationChain,
  destinationAccount,
  tokenAddress,
  amount,
  provider,
  ethAddress,
  feeTokenAddress = "",
}) => {
  /* 
  ==================================================
      Section: INITIALIZATION
      This section of the code parses the source and 
      destination router addresses and blockchain 
      selectors.
      It also initialized the ethers providers 
      to communicate with the blockchains.
  ==================================================
  */

  // Get the RPC URL for the chain from the config
  // fetch the signer privateKey

  // Get the router's address for the specified chain
  const sourceRouterAddress = getRouterConfig(sourceChain).address;
  const sourceChainSelector = getRouterConfig(sourceChain).chainSelector;
  // Get the chain selector for the target chain
  console.log(sourceRouterAddress, sourceChain);
  const destinationChainSelector =
    getRouterConfig(destinationChain).chainSelector;

  // Create a contract instance for the router using its ABI and address
  const sourceRouter = getContractCustomABI(
    sourceRouterAddress,
    routerAbi as any,
    provider,
  );

  /* 
  ==================================================
      Section: Check token validity
      Check first if the token you would like to 
      transfer is supported.
  ==================================================
  */

  // Fetch the list of supported tokens
  const supportedTokens = await sourceRouter.methods
    .getSupportedTokens(destinationChainSelector)
    .call();

  console.log(supportedTokens, "tokens");

  if (!supportedTokens.includes(tokenAddress)) {
    throw Error(
      `Token address ${tokenAddress} not in the list of supportedTokens ${supportedTokens}`,
    );
  }

  /* 
  ==================================================
      Section: BUILD CCIP MESSAGE
      build CCIP message that you will send to the
      Router contract.
  ==================================================
  */

  // build message
  const tokenAmounts = [
    {
      token: tokenAddress,
      amount: amount,
    },
  ];

  // Encoding the data

  const functionSelector = ethers.utils.id("CCIP EVMExtraArgsV1").slice(0, 10);
  //  "extraArgs" is a structure that can be represented as [ 'uint256']
  // extraArgs are { gasLimit: 0 }
  // we set gasLimit specifically to 0 because we are not sending any data so we are not expecting a receiving contract to handle data

  const extraArgs = ethers.utils.defaultAbiCoder.encode(["uint256"], [0]);

  const encodedExtraArgs = functionSelector + extraArgs.slice(2);

  console.log(functionSelector, extraArgs, encodedExtraArgs);

  const message = {
    receiver: ethers.utils.defaultAbiCoder.encode(
      ["address"],
      [destinationAccount],
    ),
    data: "0x", // no data
    tokenAmounts: tokenAmounts,
    feeToken: feeTokenAddress ? feeTokenAddress : ethers.constants.AddressZero, // If fee token address is provided then fees must be paid in fee token.
    extraArgs: encodedExtraArgs,
  };

  /* 
  ==================================================
      Section: CALCULATE THE FEES
      Call the Router to estimate the fees for sending tokens.
  ==================================================
  */

  const fees = await sourceRouter.methods
    .getFee(destinationChainSelector, message)
    .call();
  console.log(`Estimated fees (wei): ${fees}`);

  /* 
  ==================================================
      Section: SEND tokens
      This code block initializes an ERC20 token contract for token transfer across chains. It handles three cases:
      1. If the fee token is the native blockchain token, it makes one approval for the transfer amount. The fees are included in the msg.value field.
      2. If the fee token is different from both the native blockchain token and the transfer token, it makes two approvals: one for the transfer amount and another for the fees. The fees are part of the message.
      3. If the fee token is the same as the transfer token but not the native blockchain token, it makes a single approval for the sum of the transfer amount and fees. The fees are part of the message.
      The code waits for the transaction to be mined and stores the transaction receipt.
  ==================================================
  */

  // Create a contract instance for the token using its ABI and address
  const erc20 = getContractCustomABI(tokenAddress, erc20Abi as any, provider);
  let sendTx, approvalTx;

  if (!feeTokenAddress) {
    // Pay native
    // First approve the router to spend tokens
    const allowance = await erc20.methods
      .allowance(ethAddress, sourceRouterAddress)
      .call();
    if (allowance < amount) {
      approvalTx = await erc20.methods
        .approve(sourceRouterAddress, amount)
        .send({ from: ethAddress });

      console.log(
        `approved router ${sourceRouterAddress} to spend ${amount} of token ${tokenAddress}. Transaction: ${approvalTx.hash}`,
      );
    }
    console.log(fees);
    sendTx = await sourceRouter.methods
      .ccipSend(destinationChainSelector, message)
      .send({ from: ethAddress, value: fees }); // fees are send as value since we are paying the fees in native
  } else {
    if (tokenAddress.toUpperCase() === feeTokenAddress.toUpperCase()) {
      // fee token is the same as the token to transfer
      // Amount tokens to approve are transfer amount + fees
      approvalTx = await erc20.methods
        .approve(sourceRouterAddress, amount + fees)
        .send({ from: ethAddress });
      await approvalTx.wait(); // wait for the transaction to be mined
      console.log(
        `approved router ${sourceRouterAddress} to spend ${amount} and fees ${fees} of token ${tokenAddress}. Transaction: ${approvalTx.hash}`,
      );
    } else {
      // fee token is different than the token to transfer
      // 2 approvals
      approvalTx = await erc20.methods
        .approve(sourceRouterAddress, amount)
        .send({ from: ethAddress }); // 1 approval for the tokens to transfer
      await approvalTx.wait(); // wait for the transaction to be mined
      console.log(
        `approved router ${sourceRouterAddress} to spend ${amount} of token ${tokenAddress}. Transaction: ${approvalTx.hash}`,
      );
      const erc20Fees = getContractCustomABI(
        feeTokenAddress as any,
        erc20Abi as any,
        provider,
      );
      approvalTx = await erc20Fees.methods
        .approve(sourceRouterAddress, fees)
        .send({ from: ethAddress }); // 1 approval for the fees token
      await approvalTx.wait();
      console.log(
        `approved router ${sourceRouterAddress} to spend  fees ${fees} of token ${feeTokenAddress}. Transaction: ${approvalTx.hash}`,
      );
    }
    sendTx = await sourceRouter.methods
      .ccipSend(destinationChainSelector, message)
      .send({ from: ethAddress });
  }

  const receipt = await sendTx.wait(); // wait for the transaction to be mined

  /* 
  ==================================================
      Section: Fetch message ID
      The Router ccipSend function returns the messageId.
      This section makes a call (simulation) to the blockchain
      to fetch the messageId that was returned by the Router.
  ==================================================
  */

  // Simulate a call to the router to fetch the messageID
  const call = {
    from: sendTx.from,
    to: sendTx.to,
    data: sendTx.data,
    gasLimit: sendTx.gasLimit,
    gasPrice: sendTx.gasPrice,
    value: sendTx.value,
  };

  // Simulate a contract call with the transaction data at the block before the transaction
  const messageId = await provider.call(call, receipt.blockNumber - 1);

  console.log(
    `\n✅ ${amount} of Tokens(${tokenAddress}) Sent to account ${destinationAccount} on destination chain ${destinationChain} using CCIP. Transaction hash ${sendTx.hash} -  Message id is ${messageId}`,
  );

  /* 
  ==================================================
      Section: Check status of the destination chain
      Poll the off-ramps contracts of the destination chain
      to wait for the message to be executed then return
      the status.
  ==================================================
  */

  // Fetch status on destination chain
  const destinationRpcUrl = getProviderRpcUrl(destinationChain);

  // Initialize providers for interacting with the blockchains
  const destinationProvider = new ethers.providers.JsonRpcProvider(
    destinationRpcUrl,
  );
  const destinationRouterAddress = getRouterConfig(destinationChain).address;

  // Instantiate the router contract on the destination chain
  const destinationRouterContract = new ethers.Contract(
    destinationRouterAddress,
    routerAbi,
    destinationProvider,
  );

  // CHECK DESTINATION CHAIN - POLL UNTIL the messageID is found or timeout

  const POLLING_INTERVAL = 60000; // Poll every 60 seconds
  const TIMEOUT = 40 * 60 * 1000; // 40 minutes in milliseconds

  let pollingId;
  let timeoutId;

  const pollStatus = async () => {
    // Fetch the OffRamp contract addresses on the destination chain
    const offRamps = await destinationRouterContract.getOffRamps();

    // Iterate through OffRamps to find the one linked to the source chain and check message status
    for (const offRamp of offRamps) {
      if (offRamp.sourceChainSelector.toString() === sourceChainSelector) {
        const offRampContract = new ethers.Contract(
          offRamp.offRamp,
          offRampAbi,
          destinationProvider,
        );
        const events = await offRampContract.queryFilter(
          "ExecutionStateChanged",
        );

        // Check if an event with the specific messageId exists and log its status
        for (let event of events) {
          if (event.args && event.args.messageId === messageId) {
            const state = event.args.state;
            const status = getMessageState(state);
            console.log(
              `\n✅Status of message ${messageId} is ${status} - Check the explorer https://ccip.chain.link/msg/${messageId}`,
            );

            // Clear the polling and the timeout
            clearInterval(pollingId);
            clearTimeout(timeoutId);
            return;
          }
        }
      }
    }
    // If no event found, the message has not yet been processed on the destination chain
    console.log(
      `Message ${messageId} has not been processed yet on the destination chain.Try again in 60sec - Check the explorer https://ccip.chain.link/msg/${messageId}`,
    );
  };

  // Start polling
  console.log(
    `\nWait for message ${messageId} to be executed on the destination chain - Check the explorer https://ccip.chain.link/msg/${messageId}`,
  );
  pollingId = setInterval(pollStatus, POLLING_INTERVAL);

  // Set timeout to stop polling after 40 minutes
  timeoutId = setTimeout(() => {
    console.log(
      "\nTimeout reached. Stopping polling - check again later (Run `get-status` script) Or check the explorer https://ccip.chain.link/msg/${messageId}",
    );
    clearInterval(pollingId);
  }, TIMEOUT);
};
