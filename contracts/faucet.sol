// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILibraryToken {
    function mint(
        address to,
        uint256 amount
    ) external;

    function transferFrom(
        address from,
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

    constructor(address _tokenAddress) {
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
    }

    function claimTokens() public {
        require(
            block.timestamp >=
                lastClaimTime[msg.sender] + CLAIM_COOLDOWN,
            "Please wait before claiming again"
        );

        lastClaimTime[msg.sender] = block.timestamp;

        token.mint(msg.sender, FAUCET_AMOUNT);

        emit TokensClaimed(
            msg.sender,
            FAUCET_AMOUNT
        );
    }

    function consumeToken(
        address user
    ) public onlyLibrary {
        require(
            token.balanceOf(user) >= BORROW_COST,
            "Insufficient library tokens"
        );

        bool success = token.transferFrom(
            user,
            address(this),
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