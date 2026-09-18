# 📚 Decentralized Library dApp

A blockchain-powered decentralized library application built on **Ethereum Sepolia**. The platform demonstrates how smart contracts, ERC-20-style tokens, wallet authentication, and a web-based frontend can be combined to create a decentralized digital library system.

Users can connect their MetaMask wallet, claim test LIB tokens, borrow digital resources, view their borrowing history, read borrowed resources, and independently verify blockchain transactions through Sepolia Etherscan.

---

## ◀️ Demo
[Demo Video](https://drive.google.com/file/d/1uAIbOGIO3UpNg-Z_8PfWasJsydxoLuhf/view?usp=drivesdk)

---

## 📌 Project Overview

The Decentralized Library dApp replaces a traditional centralized borrowing workflow with blockchain-based smart contracts.

Instead of relying entirely on a centralized database to maintain borrowing records, the application uses Ethereum smart contracts to manage:

- Library resources
- User borrowing records
- LIB token transfers
- Faucet token distribution
- Access control
- Transaction verification

The application is deployed on the **Ethereum Sepolia testnet** for development and demonstration purposes.

---

## ✨ Key Features

### 🔐 Wallet Integration

- MetaMask wallet connection
- Connected wallet address display
- Wallet disconnect functionality
- Wallet reconnection support

### ⛓️ Blockchain Integration

- Ethereum Sepolia testnet support
- Smart contract interaction through Ethers.js
- On-chain borrowing operations
- Blockchain transaction confirmation
- Sepolia Etherscan transaction verification

### 🪙 LIB Token System

- Custom LIB token
- Faucet-based token distribution
- Users can claim **5 LIB**
- Borrowing costs **1 LIB per resource**
- Faucet includes a **24-hour claim cooldown**

### 📖 Library System

- Library resources loaded from the smart contract
- Resource categories and descriptions
- Borrowing status
- Borrowing transaction processing
- Borrowing history
- Reading interface for borrowed resources

### 🛡️ Validation & Error Handling

- Sepolia network validation
- Transaction rejection handling
- Insufficient token handling
- Faucet cooldown protection
- Smart contract revert handling
- User-friendly transaction status messages

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    │     MetaMask        │
                    └──────────┬──────────┘
                               │
                               │ Wallet / Transactions
                               ▼
                    ┌─────────────────────┐
                    │   Web Frontend      │
                    │ HTML / CSS / JS     │
                    │      Ethers.js      │
                    └──────────┬──────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
                 ▼             ▼             ▼
        ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
        │ LibraryToken │ │    Faucet    │ │   Library    │
        │  Contract    │ │   Contract   │ │   Contract   │
        └──────────────┘ └──────────────┘ └──────────────┘
                 │             │             │
                 └─────────────┼─────────────┘
                               ▼
                    ┌─────────────────────┐
                    │ Ethereum Sepolia    │
                    │      Testnet        │
                    └─────────────────────┘
```

---

## 🔄 Application Workflow

### 1. Connect Wallet

The user connects MetaMask to the application.

The frontend checks that the wallet is connected to Ethereum Sepolia.

### 2. Claim LIB Tokens

The user requests 5 LIB tokens from the Faucet contract.

The Faucet verifies:

- The wallet has not claimed during the cooldown period.
- The Faucet has sufficient token balance.

If the conditions are satisfied, 5 LIB tokens are transferred to the user.

### 3. Browse Library Resources

The frontend retrieves library resource information from the Library smart contract.

Each resource contains information such as:

- Resource ID
- Title
- Description
- Category
- Borrowing status

### 4. Borrow a Resource

The user selects an available resource.

The Library contract processes the borrowing operation and interacts with the Faucet to consume 1 LIB token.

The borrowing state is recorded on-chain.

### 5. View Borrowing History

The application identifies resources already borrowed by the connected wallet and displays them in the Borrowing History section.

### 6. Read Borrowed Resources

Borrowed resources provide a **Read** interface where users can view the associated resource content.

### 7. Verify Blockchain Transactions

Successful transactions provide Sepolia Etherscan links so that users can inspect the corresponding transaction on the blockchain.

---

# 🧩 Smart Contracts

The project consists of three primary smart contracts.

## LibraryToken

Responsible for the LIB token used within the application.

**Purpose:**

- Maintain LIB token balances
- Transfer LIB tokens between addresses
- Provide token balance information

---

## Faucet

Responsible for distributing LIB tokens and handling token consumption during borrowing.

### Faucet Amount

```text
5 LIB
```

### Borrow Cost

```text
1 LIB
```

### Claim Cooldown

```text
24 hours
```

The cooldown prevents a wallet from repeatedly claiming tokens within a short period.

---

## Library

Responsible for:

- Maintaining library resources
- Managing borrowing operations
- Recording borrowing status
- Connecting borrowing operations with the Faucet

---

# 📜 Deployed Contracts

All contracts are deployed on **Ethereum Sepolia**.

| Contract | Address |
|---|---|
| LibraryToken | `0xE7B67fb68b57522C6474561dCA06D64dC0F0C8b9` |
| Faucet | `0xff9161CfE7222823dbF953B29aabD98ce3D82990` |
| Library | `0xCC16e148bA1C90d5FC77b33Ec8c19E372e8ae874` |

### Network Information

| Property | Value |
|---|---|
| Network | Ethereum Sepolia |
| Chain ID | `11155111` |
| Currency | Sepolia ETH |
| Token | LIB |

---

# 📚 Available Resources

The current application contains three library resources.

| ID | Resource | Category |
|---|---|---|
| 1 | Blockchain Fundamentals | Technology |
| 2 | Smart Contract Design | Web3 |
| 3 | The Future of Libraries | Learning |

### Resource 1 - Blockchain Fundamentals

Understand wallets, blockchain fundamentals, and smart contracts.

### Resource 2 - Smart Contract Design

Explore principles involved in designing decentralized applications and smart contracts.

### Resource 3 - The Future of Libraries

Explore how blockchain technology can change ownership, access, and digital library systems.

---

# 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| Solidity | Smart contract development |
| Ethereum | Blockchain platform |
| Sepolia | Testnet |
| Ethers.js | Blockchain interaction |
| MetaMask | Wallet integration |
| HTML5 | Frontend structure |
| CSS3 | Frontend styling |
| JavaScript | Frontend logic |
| Node.js | Runtime environment |
| Express.js | Local web server |

---

# 📁 Project Structure

```text
decentralized-library-blockchain/
│
├── contracts/
│   ├── Faucet.sol
│   ├── Library.sol
│   └── LibraryToken.sol
│
├── public/
│   ├── app.js
│   ├── faucetABI.json
│   ├── index.html
│   ├── librarytokenABI.json
│   └── style.css
│
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js
```

---

# ⚙️ Prerequisites

Before running the application, install:

- Node.js
- npm
- MetaMask browser extension
- A wallet configured for Ethereum Sepolia

The wallet should contain sufficient **Sepolia ETH** to pay transaction gas fees.

---

# 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/Sami21234/decentralized-library-blockchain-project
```

Enter the project directory:

```bash
cd decentralized-library-blockchain
```

Install dependencies:

```bash
npm install
```

---

# ▶️ Running the Application Locally

Start the Express server:

```bash
node server.js
```

The application will be available at:

```text
http://localhost:3000
```

Open the URL in a browser with MetaMask installed.

---

# 🦊 MetaMask Configuration

1. Open MetaMask.
2. Select the Ethereum Sepolia network.
3. Make sure the wallet has Sepolia ETH.
4. Open the application.
5. Click **Connect Wallet**.
6. Approve the wallet connection.

---

# 🧪 Testing

The application is tested using functional and negative test cases covering the major user workflows.

The test scenarios include:

- Application loading
- Wallet connection
- Network validation
- Token balance display
- LIB token claiming
- Faucet cooldown protection
- Resource loading
- Resource borrowing
- Borrowing history
- Reading interface
- Etherscan transaction verification
- Wallet disconnect and reconnect
- Transaction/error handling

Detailed test-case screenshots are included in the project report.

---

# 🔍 Transaction Verification

Blockchain transactions generated by the application can be independently inspected using Sepolia Etherscan.

The frontend provides transaction links after successful blockchain operations.

This provides an additional verification layer for:

- Token claims
- Resource borrowing
- Transaction confirmation

---

# 🔐 Security & Design Considerations

The project includes several basic smart-contract protections:

- Owner-only library contract configuration
- Library-only token consumption
- Zero-address validation
- Faucet balance validation
- Claim cooldown protection
- Token transfer success checks
- Wallet/network validation in the frontend

This project is intended as an educational decentralized application and has not been audited for production use.

---

# ⚠️ Limitations

This project is a testnet-based educational implementation.

Current limitations include:

- The application uses Ethereum Sepolia rather than Ethereum mainnet.
- LIB is a project-specific test token.
- Library reading content is currently provided by the frontend.
- The project is not intended for production financial use.
- Smart contracts have not undergone a professional security audit.
- The Faucet uses a fixed claim cooldown.

---

# 🔮 Future Improvements

Potential future improvements include:

- IPFS-based decentralized resource storage
- NFT-based library memberships
- Role-based librarian administration
- Decentralized resource metadata
- Resource search and filtering
- Pagination for larger libraries
- Improved transaction status tracking
- Automated smart-contract testing
- Comprehensive security auditing
- Multi-network support
- Decentralized governance for library management

---

# 🌐 Deployment

The frontend can be deployed using Vercel.

The deployed application connects to the already deployed Ethereum Sepolia smart contracts.

Deployment configuration and the public application URL are added below.

**Live Application:**  
```bash
    https://decentralized-library-blockchain-pr.vercel.app/
```

**GitHub Repository:**  
```bash
    https://github.com/Sami21234/decentralized-library-blockchain-project
```

---

# 📸 Project Demonstration

The project demonstration includes:

1. Connecting MetaMask
2. Verifying Ethereum Sepolia
3. Claiming LIB tokens
4. Borrowing library resources
5. Viewing borrowing history
6. Reading borrowed resources
7. Verifying blockchain transactions
8. Testing error and validation scenarios

Screenshots of the complete test suite are included in the project report.

---

# 📄 License

This project is developed for educational and academic purposes.

The source code is provided for learning and demonstration of blockchain-based decentralized application development.

---

# 👨‍💻 Project Status

```text
Smart Contracts       ✅ Deployed
Frontend               ✅ Completed
Wallet Integration     ✅ Completed
LIB Faucet             ✅ Completed
Resource Borrowing     ✅ Completed
Borrowing History      ✅ Completed
Reading Interface      ✅ Completed
Etherscan Links        ✅ Completed
Error Handling         ✅ Completed
GitHub                 ✅ Completed
Vercel Deployment      🔄 Pending
Testing Documentation  ✅ Completed
```