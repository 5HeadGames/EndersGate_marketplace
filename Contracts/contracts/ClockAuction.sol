// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "hardhat/console.sol";

import "./interfaces/IERC1155Custom.sol";

/// @title Clock auction for non-fungible tokens.
contract ClockAuction is Ownable, Pausable {
  using Address for address payable;

  // Represents an auction on an NFT
  struct Auction {
    // Current owner of NFT
    address seller;
    // Price (in wei) at beginning of auction
    uint128 startingPrice;
    // Price (in wei) at end of auction
    uint128 endingPrice;
    // Duration (in seconds) of auction
    uint64 duration;
    // Time when auction started
    // NOTE: 0 if this auction has been concluded
    uint64 startedAt;
  }

  // Cut owner takes on each auction, measured in basis points (1/100 of a percent).
  // Values 0-10,000 map to 0%-100%
  uint256 public ownerCut;

  // Map from token ID to their corresponding auction.
  mapping(address => mapping(uint256 => Auction)) public auctions;

  event AuctionCreated(
    address indexed _nftAddress,
    uint256 indexed _tokenId,
    uint256 _startingPrice,
    uint256 _endingPrice,
    uint256 _duration,
    address _seller
  );

  event AuctionSuccessful(
    address indexed _nftAddress,
    uint256 indexed _tokenId,
    uint256 _totalPrice,
    address _winner
  );

  event AuctionCancelled(address indexed _nftAddress, uint256 indexed _tokenId);

  /// @dev Constructor creates a reference to the NFT ownership contract
  ///  and verifies the owner cut is in the valid range.
  /// @param _ownerCut - percent cut the owner takes on each auction, must be
  ///  between 0-10,000.
  constructor(uint256 _ownerCut) {
    require(_ownerCut <= 10000);
    ownerCut = _ownerCut;
  }

  /// @dev DON'T give me your money.
  receive() external payable {
    require(false, "DONT_SEND");
  }

  // Modifiers to check that inputs can be safely stored with a certain
  // number of bits. We use constants and multiple modifiers to save gas.
  modifier canBeStoredWith64Bits(uint256 _value) {
    require(_value <= 18446744073709551615);
    _;
  }

  modifier canBeStoredWith128Bits(uint256 _value) {
    require(_value < 340282366920938463463374607431768211455);
    _;
  }

  /// @dev Returns auction info for an NFT on auction.
  /// @param _nftAddress - Address of the NFT.
  /// @param _tokenId - ID of NFT on auction.
  function getAuction(address _nftAddress, uint256 _tokenId)
    external
    view
    returns (
      address seller,
      uint256 startingPrice,
      uint256 endingPrice,
      uint256 duration,
      uint256 startedAt
    )
  {
    Auction storage _auction = auctions[_nftAddress][_tokenId];
    require(_isOnAuction(_auction));
    return (
      _auction.seller,
      _auction.startingPrice,
      _auction.endingPrice,
      _auction.duration,
      _auction.startedAt
    );
  }

  /// @dev Returns the current price of an auction.
  /// @param _nftAddress - Address of the NFT.
  /// @param _tokenId - ID of the token price we are checking.
  function getCurrentPrice(address _nftAddress, uint256 _tokenId)
    external
    view
    returns (uint256)
  {
    Auction storage _auction = auctions[_nftAddress][_tokenId];
    require(_isOnAuction(_auction));
    return _getCurrentPrice(_auction);
  }

  /// @dev Creates and begins a new auction.
  /// @param _nftAddress - address of a deployed contract implementing
  ///  the Nonfungible Interface.
  /// @param _tokenId - ID of token to auction, sender must be owner.
  /// @param _startingPrice - Price of item (in wei) at beginning of auction.
  /// @param _endingPrice - Price of item (in wei) at end of auction.
  /// @param _duration - Length of time to move between starting
  ///  price and ending price (in seconds).
  function createAuction(
    address _nftAddress,
    uint256 _tokenId,
    uint256 _startingPrice,
    uint256 _endingPrice,
    uint256 _duration
  )
    external
    whenNotPaused
    canBeStoredWith128Bits(_startingPrice)
    canBeStoredWith128Bits(_endingPrice)
    canBeStoredWith64Bits(_duration)
  {
    address _seller = _msgSender();
    require(_owns(_nftAddress, _seller, _tokenId));
    _escrow(_nftAddress, _seller, _tokenId);
    Auction memory _auction = Auction(
      _seller,
      uint128(_startingPrice),
      uint128(_endingPrice),
      uint64(_duration),
      uint64(block.timestamp)
    );
    _addAuction(_nftAddress, _tokenId, _auction, _seller);
  }

  /// @dev Bids on an open auction, completing the auction and transferring
  ///  ownership of the NFT if enough Ether is supplied.
  /// @param _nftAddress - address of a deployed contract implementing
  ///  the Nonfungible Interface.
  /// @param _tokenId - ID of token to bid on.
  function bid(address _nftAddress, uint256 _tokenId) external payable whenNotPaused {
    // _bid will throw if the bid or funds transfer fails
    _bid(_nftAddress, _tokenId, msg.value);
    _transfer(_nftAddress, msg.sender, _tokenId);
  }

  /// @dev Cancels an auction that hasn't been won yet.
  ///  Returns the NFT to original owner.
  /// @notice This is a state-modifying function that can
  ///  be called while the contract is paused.
  /// @param _nftAddress - Address of the NFT.
  /// @param _tokenId - ID of token on auction
  function cancelAuction(address _nftAddress, uint256 _tokenId) external {
    Auction storage _auction = auctions[_nftAddress][_tokenId];
    require(_isOnAuction(_auction));
    require(_msgSender() == _auction.seller);
    _cancelAuction(_nftAddress, _tokenId, _auction.seller);
  }

  /// @dev Cancels an auction when the contract is paused.
  ///  Only the owner may do this, and NFTs are returned to
  ///  the seller. This should only be used in emergencies.
  /// @param _nftAddress - Address of the NFT.
  /// @param _tokenId - ID of the NFT on auction to cancel.
  function cancelAuctionWhenPaused(address _nftAddress, uint256 _tokenId)
    external
    whenPaused
    onlyOwner
  {
    Auction storage _auction = auctions[_nftAddress][_tokenId];
    require(_isOnAuction(_auction));
    _cancelAuction(_nftAddress, _tokenId, _auction.seller);
  }

  /// @dev Returns true if the NFT is on auction.
  /// @param _auction - Auction to check.
  function _isOnAuction(Auction storage _auction) internal view returns (bool) {
    return (_auction.startedAt > 0);
  }

  /// @dev Gets the NFT object from an address, validating that implementsERC721 is true.
  /// @param _nftAddress - Address of the NFT.
  function _getNftContract(address _nftAddress) internal pure returns (IERC1155Custom) {
    IERC1155Custom candidateContract = IERC1155Custom(_nftAddress);
    // require(candidateContract.implementsERC721());
    return candidateContract;
  }

  /// @dev Returns current price of an NFT on auction. Broken into two
  ///  functions (this one, that computes the duration from the auction
  ///  structure, and the other that does the price computation) so we
  ///  can easily test that the price computation works correctly.
  function _getCurrentPrice(Auction storage _auction) internal view returns (uint256) {
    uint256 _secondsPassed = 0;

    // A bit of insurance against negative values (or wraparound).
    // Probably not necessary (since Ethereum guarantees that the
    // block.timestamp variable doesn't ever go backwards).
    if (block.timestamp > _auction.startedAt) {
      _secondsPassed = block.timestamp - _auction.startedAt;
    }

    return
      _computeCurrentPrice(
        _auction.startingPrice,
        _auction.endingPrice,
        _auction.duration,
        _secondsPassed
      );
  }

  function _computeCurrentPrice(
    uint256 _startingPrice,
    uint256 _endingPrice,
    uint256 _duration,
    uint256 _secondsPassed
  ) internal pure returns (uint256) {
    if (_secondsPassed >= _duration) {
      // We've reached the end of the dynamic pricing portion
      // of the auction, just return the end price.
      return _endingPrice;
    } else {
      // Starting price can be higher than ending price (and often is!), so
      // this delta can be negative.
      int256 _totalPriceChange = int256(_endingPrice) - int256(_startingPrice);

      // This multiplication can't overflow, _secondsPassed will easily fit within
      // 64-bits, and _totalPriceChange will easily fit within 128-bits, their product
      // will always fit within 256-bits.
      int256 _currentPriceChange = (_totalPriceChange * int256(_secondsPassed)) /
        int256(_duration);

      // _currentPriceChange can be negative, but if so, will have a magnitude
      // less that _startingPrice. Thus, this result will always end up positive.
      int256 _currentPrice = int256(_startingPrice) + _currentPriceChange;

      return uint256(_currentPrice);
    }
  }

  /// @dev Returns true if the claimant owns the token.
  /// @param _nftAddress - The address of the NFT.
  /// @param _claimant - Address claiming to own the token.
  /// @param _tokenId - ID of token whose ownership to verify.
  function _owns(
    address _nftAddress,
    address _claimant,
    uint256 _tokenId
  ) internal view returns (bool) {
    IERC1155Custom _nftContract = _getNftContract(_nftAddress);
    return (_nftContract.balanceOf(_claimant, _tokenId) > 0);
  }

  /// @dev Adds an auction to the list of open auctions. Also fires the
  ///  AuctionCreated event.
  /// @param _tokenId The ID of the token to be put on auction.
  /// @param _auction Auction to add.
  function _addAuction(
    address _nftAddress,
    uint256 _tokenId,
    Auction memory _auction,
    address _seller
  ) internal {
    // Require that all auctions have a duration of
    // at least one minute. (Keeps our math from getting hairy!)
    require(_auction.duration >= 1 minutes);

    auctions[_nftAddress][_tokenId] = _auction;

    emit AuctionCreated(
      _nftAddress,
      _tokenId,
      uint256(_auction.startingPrice),
      uint256(_auction.endingPrice),
      uint256(_auction.duration),
      _seller
    );
  }

  /// @dev Removes an auction from the list of open auctions.
  /// @param _tokenId - ID of NFT on auction.
  function _removeAuction(address _nftAddress, uint256 _tokenId) internal {
    delete auctions[_nftAddress][_tokenId];
  }

  /// @dev Cancels an auction unconditionally.
  function _cancelAuction(
    address _nftAddress,
    uint256 _tokenId,
    address _seller
  ) internal {
    _removeAuction(_nftAddress, _tokenId);
    _transfer(_nftAddress, _seller, _tokenId);
    emit AuctionCancelled(_nftAddress, _tokenId);
  }

  /// @dev Escrows the NFT, assigning ownership to this contract.
  /// Throws if the escrow fails.
  /// @param _nftAddress - The address of the NFT.
  /// @param _owner - Current owner address of token to escrow.
  /// @param _tokenId - ID of token whose approval to verify.
  function _escrow(
    address _nftAddress,
    address _owner,
    uint256 _tokenId
  ) internal {
    IERC1155Custom _nftContract = _getNftContract(_nftAddress);

    // It will throw if transfer fails
    _nftContract.safeTransferFrom(_owner, address(this), _tokenId, 1, "");
  }

  /// @dev Transfers an NFT owned by this contract to another address.
  /// Returns true if the transfer succeeds.
  /// @param _nftAddress - The address of the NFT.
  /// @param _receiver - Address to transfer NFT to.
  /// @param _tokenId - ID of token to transfer.
  function _transfer(
    address _nftAddress,
    address _receiver,
    uint256 _tokenId
  ) internal {
    IERC1155Custom _nftContract = _getNftContract(_nftAddress);

    // It will throw if transfer fails
    _nftContract.safeTransferFrom(address(this), _receiver, _tokenId, 1, "");
  }

  /// @dev Computes owner's cut of a sale.
  /// @param _price - Sale price of NFT.
  function _computeCut(uint256 _price) internal view returns (uint256) {
    return (_price * ownerCut) / 10000;
  }

  /// @dev Computes the price and transfers winnings.
  /// Does NOT transfer ownership of token.
  function _bid(
    address _nftAddress,
    uint256 _tokenId,
    uint256 _bidAmount
  ) internal returns (uint256) {
    // Get a reference to the auction struct
    Auction storage _auction = auctions[_nftAddress][_tokenId];

    // Explicitly check that this auction is currently live.
    // (Because of how Ethereum mappings work, we can't just count
    // on the lookup above failing. An invalid _tokenId will just
    // return an auction object that is all zeros.)
    require(_isOnAuction(_auction));

    // Check that the incoming bid is higher than the current
    // price
    uint256 _price = _getCurrentPrice(_auction);
    require(_bidAmount >= _price);

    // Grab a reference to the seller before the auction struct
    // gets deleted.
    address payable _seller = payable(_auction.seller);

    // The bid is good! Remove the auction before sending the fees
    // to the sender so we can't have a reentrancy attack.
    _removeAuction(_nftAddress, _tokenId);

    // Transfer proceeds to seller (if there are any!)
    if (_price > 0) {
      //  Calculate the auctioneer's cut.
      // (NOTE: _computeCut() is guaranteed to return a
      //  value <= price, so this subtraction can't go negative.)
      uint256 _auctioneerCut = _computeCut(_price);
      uint256 _sellerProceeds = _price - _auctioneerCut;

      // NOTE: Doing a transfer() in the middle of a complex
      // method like this is generally discouraged because of
      // reentrancy attacks and DoS attacks if the seller is
      // a contract with an invalid fallback function. We explicitly
      // guard against reentrancy attacks by removing the auction
      // before calling transfer(), and the only thing the seller
      // can DoS is the sale of their own asset! (And if it's an
      // accident, they can call cancelAuction(). )
      _seller.sendValue(_sellerProceeds);
    }

    if (_bidAmount > _price) {
      // Calculate any excess funds included with the bid. If the excess
      // is anything worth worrying about, transfer it back to bidder.
      // NOTE: We checked above that the bid amount is greater than or
      // equal to the price so this cannot underflow.
      uint256 _bidExcess = _bidAmount - _price;

      // Return the funds. Similar to the previous transfer, this is
      // not susceptible to a re-entry attack because the auction is
      // removed before any transfers occur.
      payable(_msgSender()).sendValue(_bidExcess);
    }

    // Tell the world!
    emit AuctionSuccessful(_nftAddress, _tokenId, _price, msg.sender);

    return _price;
  }
}
