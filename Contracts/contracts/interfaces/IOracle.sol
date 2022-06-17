// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

interface IOracle {
    function update() external;

    function consult(address token, uint256 amountIn) external view;
}
