pragma solidity ^0.4.0;
contract Auction {
    address public holder;
    uint256 public deposit;
    address public highestbidder;
    address[] public bidders;
    mapping(address => uint256) public price;
    bool public valid;
    bool public isInit;
    bool public isCancel;
    uint public endTime;
    uint public id;
    event signal(string message, address user);
    constructor(address _holder, uint _id) public payable {
        id = _id;
        holder = _holder;
        valid = false;
        isInit = false;
        isCancel = false;
        highestbidder = 0x00;
    }
    function init(uint256 timeSpan) public payable returns(bool) {
        require (
            msg.sender == holder,
            "Only holder can init this bid."
        );
        require (
            isInit == false,
            "Bid is already init."
        );
        deposit = msg.value;
        endTime = timeSpan;
        isInit = true;
        valid = true;
        emit signal("init", msg.sender);
    }
    function bid() public payable{
        require (
            msg.sender != holder,
            "Holder cannot bid."
        );
        require (
            valid,
            "Bid already end."
        );
        if (highestbidder == 0x00) highestbidder = msg.sender;
        require (
            msg.value + price[msg.sender] > price[highestbidder],
            "Price lower then highest bid."
        );
        if (!isBidder(msg.sender)) bidders.push(msg.sender);
        price[msg.sender] += msg.value;
        highestbidder = msg.sender;
        emit signal("bid", msg.sender);
    }
    function quit() public payable returns(bool) {
        require (
            price[msg.sender] != 0,
            "Not in this bid."
        );
        require (
            msg.sender != highestbidder,
            "Highest bidder cannot quit."
        );
        uint256 p = price[msg.sender];
        price[msg.sender] = 0;
        msg.sender.transfer(p);
        emit  signal("quit", msg.sender);
        return true;
    }
    function auctionEnd() public payable {
        require(
            valid,
            "Auction already end."
        );
        require (
            now > endTime,
            "End time not arrived."
        );
        holder.transfer(deposit);
        for (uint32 i = 0; i < bidders.length; i++) {
            if (price[bidders[i]] != 0 && bidders[i] != highestbidder) {
                uint256 p = price[bidders[i]];
                price[bidders[i]] = 0;
                bidders[i].transfer(p);
            }
        }
         emit signal("end", msg.sender);
        valid = false;
    }

    function auctionConfirm() public payable {
        require (
            !valid,
            "Auction not end."
        );
        require (
            highestbidder == msg.sender,
            "Only highest bidder can confirm it."
        );
        holder.transfer(price[highestbidder]);
        emit signal("confirm", msg.sender);
    }

    function auctionCancel() public payable {
        require(
            valid,
            "Auction already end."
        );
        require (
            holder == msg.sender,
            "Auction can only cancelled by holder."
        );
        for (uint32 i = 0; i < bidders.length; i++) {
            if (price[bidders[i]] != 0) {
                bidders[i].transfer(price[bidders[i]]);
                price[bidders[i]] = 0;
            }
        }
        highestbidder.transfer(deposit);
        valid = false;
        isCancel = true;
        emit signal("cancel", msg.sender);
    }

    function isBidder(address bidder) private view returns(bool) {
        for (uint32 i = 0; i < bidders.length; i++) {
            if (bidders[i] == bidder) return true;
        }
        return false;
    }
}

contract AuctionDispatcher {
    address[] public auctions;
    event NewAuction(uint id, address auctionAddress);
    function getAuctions() public view returns(address[]) {
        return auctions;
    }
    function getNewId() public view returns(uint) {
        return auctions.length;
    }
    function newAuction() public payable returns(address) {
        address ad =  new Auction(msg.sender, auctions.length);
        auctions.push(ad);
        emit NewAuction(auctions.length, ad);
    }
}