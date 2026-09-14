# Decentralized Library

A Web3-based decentralized library management system built on Ethereum (Sepolia Testnet). The application uses Smart Contracts written in Solidity to let users list, view, borrow, and return books using a custom utility token (`LIB`).

## 📌 Features

* **Add Books:** Add new books to the blockchain registry.
* **Borrow Books:** Borrow available books by spending 1 `LIB` token managed via a integrated Faucet mechanism.
* **Return Books:** Return borrowed books to set their status back to available.
* **View Details:** Retrieve book details including title, owner, current borrower, and availability status on-chain.
* **MetaMask Integration:** Web3 wallet connection using Ethers.js v6.

---

## 🛠 Project Architecture

The repository consists of smart contracts and a vanilla JavaScript/HTML frontend:

```text
decentralized-library/
├── LibraryToken.sol          # Faucet & Token contract handling LIB tokens
├── DecentralizedLibrary.sol  # Main library application logic
├── index.html                # Frontend User Interface
├── style.css                 # Application styling
└── app.js                    # Web3 interaction logic via Ethers.js