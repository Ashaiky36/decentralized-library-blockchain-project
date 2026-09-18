// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ILibraryFaucet {
    function consumeToken(address user) external;
}

contract Library {
    // State variables

    ILibraryFaucet public faucet;

    address public owner;

    uint256 public resourceCount;

    struct Resource {
        uint256 id;
        string title;
        string description;
        string category;
        bool exists;
    }

    mapping(uint256 => Resource) public resources;

    // user address => resource ID => borrowed
    mapping(address => mapping(uint256 => bool)) public hasBorrowed;

    // Events

    event ResourceAdded(
        uint256 indexed resourceId,
        string title,
        string category
    );

    event ResourceBorrowed(
        address indexed user,
        uint256 indexed resourceId,
        string title
    );

    event FaucetUpdated(address indexed faucetAddress);

    // Modifiers

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only owner can perform this action"
        );
        _;
    }

    // Constructor

    constructor(address _faucetAddress) {
        require(
            _faucetAddress != address(0),
            "Invalid Faucet address"
        );

        owner = msg.sender;
        faucet = ILibraryFaucet(_faucetAddress);
    }

    // Update Faucet address

    function setFaucet(address _faucetAddress)
        public
        onlyOwner
    {
        require(
            _faucetAddress != address(0),
            "Invalid Faucet address"
        );

        faucet = ILibraryFaucet(_faucetAddress);

        emit FaucetUpdated(_faucetAddress);
    }

    // Add a resource

    function addResource(
        string memory _title,
        string memory _description,
        string memory _category
    )
        public
        onlyOwner
    {
        require(
            bytes(_title).length > 0,
            "Title cannot be empty"
        );

        resourceCount++;

        resources[resourceCount] = Resource({
            id: resourceCount,
            title: _title,
            description: _description,
            category: _category,
            exists: true
        });

        emit ResourceAdded(
            resourceCount,
            _title,
            _category
        );
    }

    // Get a resource

    function getResource(uint256 _resourceId)
        public
        view
        returns (
            uint256 id,
            string memory title,
            string memory description,
            string memory category,
            bool exists
        )
    {
        Resource memory resource = resources[_resourceId];

        return (
            resource.id,
            resource.title,
            resource.description,
            resource.category,
            resource.exists
        );
    }

    // Borrow a resource

    function borrowResource(uint256 _resourceId)
        public
    {
        Resource memory resource = resources[_resourceId];

        require(
            resource.exists,
            "Resource does not exist"
        );

        require(
            !hasBorrowed[msg.sender][_resourceId],
            "You already borrowed this resource"
        );

        // The Faucet transfers 1 LIB from the user.
        // The user must approve the Faucet to spend 1 LIB first.
        faucet.consumeToken(msg.sender);

        hasBorrowed[msg.sender][_resourceId] = true;

        emit ResourceBorrowed(
            msg.sender,
            _resourceId,
            resource.title
        );
    }

    // Check whether a user borrowed a resource

    function userHasBorrowed(
        address _user,
        uint256 _resourceId
    )
        public
        view
        returns (bool)
    {
        return hasBorrowed[_user][_resourceId];
    }

    // Transfer contract ownership

    function transferOwnership(address _newOwner)
        public
        onlyOwner
    {
        require(
            _newOwner != address(0),
            "Invalid owner address"
        );

        owner = _newOwner;
    }
}