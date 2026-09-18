// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILibraryToken {
    function transfer(
        address to,
        uint256 amount
    ) external returns (bool);

    function balanceOf(
        address account
    ) external view returns (uint256);
}

contract Faucet {
    ILibraryToken public token;

    address public owner;
    address public libraryContract;

    uint256 public constant FAUCET_AMOUNT = 5 * 10**18;
    uint256 public constant BORROW_COST = 1 * 10**18;

    mapping(address => uint256) public lastClaimTime;

    uint256 public constant CLAIM_COOLDOWN = 1 days;

    event TokensClaimed(
        address indexed user,
        uint256 amount
    );

    event TokenConsumed(
        address indexed user,
        uint256 amount
    );

    event LibraryContractUpdated(
        address indexed libraryAddress
    );

    constructor(address _tokenAddress) {
        require(
            _tokenAddress != address(0),
            "Invalid token address"
        );

        token = ILibraryToken(_tokenAddress);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only owner can perform this action"
        );
        _;
    }

    modifier onlyLibrary() {
        require(
            msg.sender == libraryContract,
            "Only library contract can call this"
        );
        _;
    }

    function setLibraryContract(
        address _libraryContract
    ) public onlyOwner {
        require(
            _libraryContract != address(0),
            "Invalid library address"
        );

        libraryContract = _libraryContract;

        emit LibraryContractUpdated(
            _libraryContract
        );
    }

    function claimTokens() public {
        require(
            block.timestamp >=
                lastClaimTime[msg.sender] + CLAIM_COOLDOWN,
            "Please wait before claiming again"
        );

        require(
            token.balanceOf(address(this)) >= FAUCET_AMOUNT,
            "Faucet has insufficient tokens"
        );

        lastClaimTime[msg.sender] = block.timestamp;

        bool success = token.transfer(
            msg.sender,
            FAUCET_AMOUNT
        );

        require(
            success,
            "Token transfer failed"
        );

        emit TokensClaimed(
            msg.sender,
            FAUCET_AMOUNT
        );
    }

    function consumeToken(
        address user
    ) public onlyLibrary {
        require(
            user != address(0),
            "Invalid user address"
        );

        require(
            token.balanceOf(address(this)) >= BORROW_COST,
            "Faucet has insufficient tokens"
        );

        bool success = token.transfer(
            user,
            BORROW_COST
        );

        require(
            success,
            "Token transfer failed"
        );

        emit TokenConsumed(
            user,
            BORROW_COST
        );
    }

    function getUserBalance(
        address user
    ) public view returns (uint256) {
        return token.balanceOf(user);
    }
}