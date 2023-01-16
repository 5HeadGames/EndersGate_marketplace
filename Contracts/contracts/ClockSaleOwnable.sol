// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

import "./interfaces/IERC1155Custom.sol";

/// @title Clock auction for non-fungible tokens.
contract ClockSaleOwnable is Ownable, Pausable, ERC1155Holder, ReentrancyGuard {
    using Address for address payable;

    enum SaleStatus {
        Created,
        Successful,
        Canceled
    }

    struct Sale {
        address seller;
        address nft;
        uint256 nftId;
        uint256 amount;
        uint256 priceUSD;
        uint256 duration;
        uint256 startedAt;
        SaleStatus status;
    }

    // Cut owner takes on each auction, measured in basis points (1/100 of a percent).
    // Values 0-10,000 map to 0%-100%
    address public feeReceiver;
    AggregatorV3Interface internal priceFeed;
    uint256 public tokenIdTracker;
    uint256 public ownerCut;

    // Map from token ID to their corresponding auction.
    mapping(uint256 => Sale) public sales;
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

    constructor(address _feeReceiver, uint256 _ownerCut) {
        require(_ownerCut <= 10000, "ClockSale:OWNER_CUT"); //less than 100%
        priceFeed = AggregatorV3Interface(
            0xAB594600376Ec9fD91F8e885dADF0CE036862dE0
        );
        ownerCut = _ownerCut;
        feeReceiver = _feeReceiver;
    }

    function getSales(uint256[] memory _tokenIds)
        external
        view
        returns (Sale[] memory)
    {
        Sale[] memory response = new Sale[](_tokenIds.length);

        for (uint256 i = 0; i < _tokenIds.length; i++)
            response[i] = sales[_tokenIds[i]];

        return response;
    }

    function getPriceONE(uint256 amountUSD) public view returns (uint256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return amountUSD / uint256(price);
    }

    function isOnSale(uint256 _tokenId) external view returns (bool) {
        Sale storage _auction = sales[_tokenId];
        return _isOnSale(_auction);
    }

    function setOwnerCut(uint256 _ownerCut) external onlyOwner {
        ownerCut = _ownerCut;
    }

    function createSale(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _priceUSD,
        uint256 _amount,
        uint256 _duration
    ) external onlyOwner {
        address _seller = _msgSender();

        require(isAllowed[_nftAddress], "ClockSale:INVALID_SALE");

        IERC1155Custom _nftContract = _getNftContract(_nftAddress);

        _nftContract.safeTransferFrom(
            _seller,
            address(this),
            _tokenId,
            _amount,
            ""
        );

        Sale memory _auction = Sale(
            _seller,
            _nftAddress,
            _tokenId,
            _amount,
            _priceUSD,
            _duration,
            block.timestamp,
            SaleStatus.Created
        );
        _addSale(_auction);
    }

    function updateSalePrice(uint256 saleId, uint256 newPrice)
        external
        onlyOwner
    {
        Sale storage _auction = sales[saleId];
        require(_saleExists(_auction), "ClockSale:NOT_AVAILABLE");
        _auction.priceUSD = newPrice;
    }

    function updateSaleReceiver(uint256 saleId, address receiver)
        external
        onlyOwner
    {
        Sale storage _auction = sales[saleId];
        require(_saleExists(_auction), "ClockSale:NOT_AVAILABLE");
        _auction.seller = receiver;
    }

    function buy(uint256 _tokenId, uint256 amount)
        external
        payable
        nonReentrant
        whenNotPaused
    {
        Sale storage sale = sales[_tokenId];

        uint256 cost = getPriceONE(sale.priceUSD * amount);
        address buyer = _msgSender();
        sale.amount -= amount;

        if (sale.amount == 0) _finalizeSale(_tokenId);

        require(_isOnSale(sale), "ClockSale:NOT_AVAILABLE");

        _makePayment(sale, cost);

        _transfer(_tokenId, amount, buyer);
        emit BuySuccessful(_tokenId, buyer, cost, amount);
    }

    function _makePayment(Sale memory sale, uint256 payAmount) internal {
        uint256 ownerAmount = (payAmount * ownerCut) / 10000;
        uint256 sellAmount = payAmount - ownerAmount;

        //wone address
        uint256 leftovers = msg.value - (ownerAmount + sellAmount);
        //Use native token
        require(
            msg.value >= payAmount,
            "ClockSaleOwnable:INSUFFICIENT_PAY_AMOUNT"
        );
        payable(sale.seller).sendValue(sellAmount);
        payable(feeReceiver).sendValue(ownerAmount);
        payable(msg.sender).sendValue(leftovers);
    }

    function cancelSale(uint256 _tokenId) external onlyOwner {
        Sale storage _auction = sales[_tokenId];
        require(_saleExists(_auction), "ClockSale:NOT_AVAILABLE");
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

    function _finalizeSale(uint256 tokenId) internal {
        Sale storage _auction = sales[tokenId];
        _auction.status = SaleStatus.Successful;
        emit SaleSuccessful(tokenId);
    }

    function _isOnSale(Sale storage _auction) internal view returns (bool) {
        return (_saleExists(_auction) &&
            _auction.startedAt + _auction.duration > block.timestamp);
    }

    function _saleExists(Sale storage _auction) internal view returns (bool) {
        return (_auction.startedAt > 0);
    }

    function _getNftContract(address _nftAddress)
        internal
        pure
        returns (IERC1155Custom)
    {
        IERC1155Custom candidateContract = IERC1155Custom(_nftAddress);
        return candidateContract;
    }

    function _addSale(Sale memory _auction) internal {
        require(_auction.duration >= 1 minutes, "ClockSale:INVALID_DURATION");

        uint256 auctionID = tokenIdTracker++;
        sales[auctionID] = _auction;

        emit SaleCreated(
            auctionID,
            _auction.amount,
            _auction.priceUSD,
            _auction.duration,
            _auction.seller
        );
    }

    function _cancelSale(uint256 _tokenId) internal {
        Sale storage _auction = sales[_tokenId];
        _auction.status = SaleStatus.Canceled;
        _transfer(_tokenId, _auction.amount, _auction.seller);
        emit SaleCancelled(_tokenId);
    }

    function _transfer(
        uint256 _tokenId,
        uint256 amount,
        address _receiver
    ) internal {
        Sale storage _auction = sales[_tokenId];
        IERC1155Custom _nftContract = _getNftContract(_auction.nft);

        _nftContract.safeTransferFrom(
            address(this),
            _receiver,
            _auction.nftId,
            amount,
            ""
        );
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Receiver)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function emergencyWithdraw(
        uint256 amount,
        address token,
        address recipient
    ) external onlyOwner {
        if (token == address(0)) payable(recipient).sendValue(amount);
        else IERC20(token).transfer(recipient, amount);
    }
}
