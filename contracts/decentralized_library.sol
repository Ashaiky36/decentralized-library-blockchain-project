// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IFaucet {
    function consumeToken(
        address user
    ) external;
}

contract DecentralizedLibrary {
    address public owner;

    IFaucet public faucet;

    enum BookStatus {
        Available,
        Borrowed
    }

    struct Book {
        uint256 id;
        string title;
        address borrower;
        BookStatus status;
    }

    uint256 public bookCount;

    mapping(uint256 => Book) public books;

    event BookAdded(
        uint256 indexed bookId,
        string title
    );

    event BookBorrowed(
        uint256 indexed bookId,
        address indexed borrower
    );

    event BookReturned(
        uint256 indexed bookId,
        address indexed borrower
    );

    constructor(address _faucetAddress) {
        owner = msg.sender;
        faucet = IFaucet(_faucetAddress);
    }

    function addBook(
        string memory title
    ) public {
        require(
            bytes(title).length > 0,
            "Title cannot be empty"
        );

        bookCount++;

        books[bookCount] = Book({
            id: bookCount,
            title: title,
            borrower: address(0),
            status: BookStatus.Available
        });

        emit BookAdded(
            bookCount,
            title
        );
    }

    function borrowBook(
        uint256 bookId
    ) public {
        require(
            bookId > 0 && bookId <= bookCount,
            "Book does not exist"
        );

        Book storage book = books[bookId];

        require(
            book.status == BookStatus.Available,
            "Book is already borrowed"
        );

        // Reduce one token from the borrower's balance.
        faucet.consumeToken(msg.sender);

        book.borrower = msg.sender;
        book.status = BookStatus.Borrowed;

        emit BookBorrowed(
            bookId,
            msg.sender
        );
    }

    function returnBook(
        uint256 bookId
    ) public {
        require(
            bookId > 0 && bookId <= bookCount,
            "Book does not exist"
        );

        Book storage book = books[bookId];

        require(
            book.status == BookStatus.Borrowed,
            "Book is not borrowed"
        );

        require(
            book.borrower == msg.sender,
            "Only borrower can return this book"
        );

        book.borrower = address(0);
        book.status = BookStatus.Available;

        emit BookReturned(
            bookId,
            msg.sender
        );
    }

    function getBook(
        uint256 bookId
    )
        public
        view
        returns (
            uint256 id,
            string memory title,
            address borrower,
            BookStatus status
        )
    {
        require(
            bookId > 0 && bookId <= bookCount,
            "Book does not exist"
        );

        Book memory book = books[bookId];

        return (
            book.id,
            book.title,
            book.borrower,
            book.status
        );
    }
}