// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import "./interfaces/IERC1155Custom.sol";

/// @title Clock auction for non-fungible tokens.
contract ClockSale is ERC721, Ownable, Pausable, ERC1155Holder {
  using Counters for Counters.Counter;
  using Address for address payable;

  struct Sale {
    address seller;
    address nft;
    uint256 nftId;
    uint256 amount;
    uint256 price;
    uint256 duration;
    uint256 startedAt;
  }

  // Cut owner takes on each auction, measured in basis points (1/100 of a percent).
  // Values 0-10,000 map to 0%-100%
  Counters.Counter private _tokenIdTracker;
  address public feeReceiver;
  uint256 public ownerCut;
  uint256 public genesisBlock;

  // Map from token ID to their corresponding auction.
  mapping(uint256 => Sale) public auctions;
  // Nfts allowed in marketplace
  mapping(address => bool) public isAllowed;

  event SaleCreated(
    uint256 indexed _auctionId,
    uint256 _amount,
    uint256 _price,
    uint256 _duration,
    address _seller
  );

  event SaleSuccessful(uint256 indexed _aucitonId);
  event BuySuccessful(
    uint256 indexed _aucitonId,
    address _buyer,
    uint256 _cost,
    uint256 _nftAmount
  );
  event SaleCancelled(uint256 indexed _auctionId);

  constructor(
    address _feeReceiver,
    uint256 _ownerCut,
    string memory _name,
    string memory _symbol
  ) ERC721(_name, _symbol) {
    require(_ownerCut <= 10000); //less than 100%
    ownerCut = _ownerCut;
    feeReceiver = _feeReceiver;
    genesisBlock = block.number;
  }

  receive() external payable {
    require(false, "DONT_SEND");
  }

  function getSales(uint256[] memory _tokenIds) external view returns (Sale[] memory) {
    Sale[] memory response = new Sale[](_tokenIds.length);

    for (uint256 i = 0; i < _tokenIds.length; i++) response[i] = auctions[_tokenIds[i]];

    return response;
  }

  function getCurrentPrice(uint256 _tokenId) external view returns (uint256) {
    Sale storage _auction = auctions[_tokenId];
    require(_isOnSale(_auction));
    return _auction.price;
  }

  function createSale(
    address _nftAddress,
    uint256 _tokenId,
    uint256 _price,
    uint256 _amount,
    uint256 _duration
  ) external whenNotPaused {
    require(isAllowed[_nftAddress], "Nft not allowed");
    address _seller = _msgSender();
    require(_owns(_nftAddress, _seller, _tokenId), "User doesn't owns nft");
    _escrow(_nftAddress, _seller, _tokenId, _amount);
    Sale memory _auction = Sale(
      _seller,
      _nftAddress,
      _tokenId,
      _amount,
      _price,
      _duration,
      block.timestamp
    );
    _addSale(_auction);
  }

  function buy(uint256 _tokenId, uint256 amount) external payable whenNotPaused {
    Sale storage _auction = auctions[_tokenId];
    uint256 cost = _auction.price * amount;
    address buyer = _msgSender();
    _auction.amount -= amount; //this will underflow if is x < 0

    if (_auction.amount == 0) _finalizeSale(_tokenId);

    require(msg.value >= cost, "NO_ENOUGH_VALUE");

    uint256 ownerAmount = (cost * ownerCut) / 10000;
    uint256 sellAmount = cost - ownerAmount;
    payable(_auction.seller).transfer(sellAmount);
    payable(feeReceiver).transfer(ownerAmount);

    _transfer(_tokenId, amount, buyer);
    emit BuySuccessful(_tokenId, buyer, cost, amount);
  }

  function _finalizeSale(uint256 tokenId) internal {
    Sale storage _auction = auctions[tokenId];
    _burn(tokenId);
    emit SaleSuccessful(tokenId);
  }

  function cancelSale(uint256 _tokenId) external {
    Sale storage _auction = auctions[_tokenId];
    require(_isOnSale(_auction));
    require(ownerOf(_tokenId) == _msgSender());
    _cancelSale(_tokenId);
  }

  function setNftAllowed(address nftAddress, bool allow) external onlyOwner {
    isAllowed[nftAddress] = allow;
  }

  function stopTrading() external onlyOwner whenNotPaused {
    _pause();
  }

  function restartTrading() external onlyOwner whenPaused {
    _unpause();
  }

  function _isOnSale(Sale storage _auction) internal view returns (bool) {
    return (_auction.startedAt > 0);
  }

  function _getNftContract(address _nftAddress) internal pure returns (IERC1155Custom) {
    IERC1155Custom candidateContract = IERC1155Custom(_nftAddress);
    return candidateContract;
  }

  function _owns(
    address _nftAddress,
    address _claimant,
    uint256 _tokenId
  ) internal view returns (bool) {
    IERC1155Custom _nftContract = _getNftContract(_nftAddress);
    return (_nftContract.balanceOf(_claimant, _tokenId) > 0);
  }

  function _addSale(Sale memory _auction) internal {
    require(_auction.duration >= 1 minutes);

    uint256 auctionID = _tokenIdTracker.current();
    auctions[auctionID] = _auction;
    _mint(_auction.seller, auctionID);
    _tokenIdTracker.increment();

    emit SaleCreated(
      auctionID,
      _auction.amount,
      _auction.price,
      _auction.duration,
      _auction.seller
    );
  }

  function _removeSale(uint256 _tokenId) internal {
    _burn(_tokenId);
  }

  function _cancelSale(uint256 _tokenId) internal {
    Sale storage _auction = auctions[_tokenId];
    _removeSale(_tokenId);
    _transfer(_tokenId, _auction.amount, _auction.seller);
    emit SaleCancelled(_tokenId);
  }

  function _escrow(
    address _nftAddress,
    address _owner,
    uint256 _tokenId,
    uint256 _amount
  ) internal {
    IERC1155Custom _nftContract = _getNftContract(_nftAddress);

    _nftContract.safeTransferFrom(_owner, address(this), _tokenId, _amount, "");
  }

  function _transfer(
    uint256 _tokenId,
    uint256 amount,
    address _receiver
  ) internal {
    Sale storage _auction = auctions[_tokenId];
    IERC1155Custom _nftContract = _getNftContract(_auction.nft);

    _nftContract.safeTransferFrom(address(this), _receiver, _auction.nftId, amount, "");
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC1155Receiver, ERC721)
    returns (bool)
  {
    return super.supportsInterface(interfaceId);
  }
}
