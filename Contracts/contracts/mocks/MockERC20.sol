// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
  constructor() ERC20("MockToken", "MT") {
    _mint(msg.sender, 100000000000000);
  }

  function decimals() public view virtual override returns (uint8) {
    return 6;
  }

  function mint(address receiver, uint256 amount) external {
    _mint(receiver, amount);
  }
}
