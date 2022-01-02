// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockNFT is ERC721 {
  uint256 private _current;

  constructor() ERC721("GameItem", "ITM") {
    _mint(msg.sender, _current++);
    _mint(msg.sender, _current++);
    _mint(msg.sender, _current++);
  }

  function getCurrentId() public view returns (uint256) {
    return _current;
  }
}
