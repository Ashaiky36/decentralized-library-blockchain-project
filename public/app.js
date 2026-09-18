"use strict";

/*
  Decentralized Library Frontend
  Network: Ethereum Sepolia
  Ethers.js: v6
*/

/* Contract addresses */

const TOKEN_ADDRESS = "0xE7B67fb68b57522C6474561dCA06D64dC0F0C8b9";

const FAUCET_ADDRESS = "0xff9161CfE7222823dbF953B29aabD98ce3D82990";

const LIBRARY_ADDRESS = "0xCC16e148bA1C90d5FC77b33Ec8c19E372e8ae874";

// Resource Contents
const RESOURCE_CONTENT = {
  1: {
    title: "Blockchain Fundamentals",
    content: `
      <p>
        Blockchain is a distributed database that records information in
        blocks connected through cryptography.
      </p>

      <p>
        Each block contains transaction data, a timestamp, and a reference
        to the previous block. This structure makes the history difficult
        to alter without network agreement.
      </p>

      <p>
        Ethereum extends this idea by allowing developers to deploy smart
        contracts. Smart contracts are programs stored on the blockchain
        that execute when their conditions are met.
      </p>
    `
  },

  2: {
    title: "Smart Contract Design",
    content: `
      <p>
        Smart contracts are self-executing programs deployed on a blockchain.
        They define rules that can be checked and enforced automatically.
      </p>

      <p>
        Good smart contract design requires clear access control, input
        validation, protection against repeated actions, and careful handling
        of token transfers.
      </p>

      <p>
        In this library project, the Library contract records borrowing while
        the Faucet handles the LIB token transfer.
      </p>
    `
  },

  3: {
    title: "The Future of Libraries",
    content: `
      <p>
        Decentralized libraries can provide transparent records of access,
        ownership, and participation.
      </p>

      <p>
        Blockchain can verify that a user has permission to access a resource
        without requiring one central organization to maintain every record.
      </p>

      <p>
        Decentralized storage systems such as IPFS can also be used to store
        larger documents while the blockchain stores their identifiers.
      </p>
    `
  }
};

/* Minimal contract ABIs */

const TOKEN_ABI = [
  "function balanceOf(address account) view returns (uint256)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
];

const FAUCET_ABI = [
  "function claimTokens()",
  "function getUserBalance(address user) view returns (uint256)",
  "function libraryContract() view returns (address)",
  "function token() view returns (address)"
];

const LIBRARY_ABI = [
  "function resourceCount() view returns (uint256)",
  "function getResource(uint256 resourceId) view returns (uint256 id, string title, string description, string category, bool exists)",
  "function borrowResource(uint256 resourceId)",
  "function userHasBorrowed(address user, uint256 resourceId) view returns (bool)",
  "function hasBorrowed(address user, uint256 resourceId) view returns (bool)",
  "function owner() view returns (address)",
  "function faucet() view returns (address)"
];

/* Application state                                                           */

let provider = null;
let signer = null;

let userAddress = null;

let tokenContract = null;
let faucetContract = null;
let libraryContract = null;

/* DOM helpers                                                                 */

const $ = (id) => document.getElementById(id);

const connectButton = $("connectButton");
const heroConnectButton = $("heroConnectButton");
const disconnectButton = $("disconnectButton");

const claimButton = $("claimButton");
const statusElement = $("status");

const tokenBalanceElement = $("tokenBalance");
const faucetBalanceElement = $("faucetBalance");
const resourceCountElement = $("resourceCount");
const networkStatusElement = $("networkStatus");
const walletAddressElement = $("walletAddress");

const resourceGrid = $("resourceGrid");

const historyList = $("historyList");

const readerModal = $("readerModal");
const readerOverlay = $("readerOverlay");
const closeReaderButton = $("closeReaderButton");
const readerTitle = $("readerTitle");
const readerContent = $("readerContent");

/* General UI helpers                                                          */

function setStatus(message, type = "normal") {
  if (!statusElement) return;

  statusElement.innerHTML = message;

  statusElement.classList.remove(
    "status-success",
    "status-error",
    "status-warning"
  );

  if (type === "success") {
    statusElement.classList.add("status-success");
  }

  if (type === "error") {
    statusElement.classList.add("status-error");
  }

  if (type === "warning") {
    statusElement.classList.add("status-warning");
  }
}

function setNetworkStatus(message, connected = false) {
  if (!networkStatusElement) {
    return;
  }

  networkStatusElement.textContent = message;

  networkStatusElement.classList.toggle("connected", connected);
}

function shortenAddress(address) {
  if (!address) {
    return "No wallet connected";
  }

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatTokenAmount(value, decimals = 18) {
  try {
    return Number(ethers.formatUnits(value, decimals)).toLocaleString(
      undefined,
      {
        maximumFractionDigits: 4
      }
    );
  } catch (error) {
    console.error("Unable to format token amount:", error);
    return "0";
  }
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setButtonsConnected(connected) {
  if (connectButton) {
    connectButton.textContent = connected
      ? shortenAddress(userAddress)
      : "Connect Wallet";
  }

  if (heroConnectButton) {
    heroConnectButton.textContent = connected
      ? "Wallet Connected"
      : "Connect Wallet";

    heroConnectButton.disabled = connected;
  }

  if (disconnectButton) {
    disconnectButton.hidden = !connected;
  }

  if (claimButton) {
    claimButton.disabled = !connected;
  }
}

/* Wallet and network                                                          */

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    setStatus(
      "MetaMask was not detected. Please install MetaMask and try again.",
      "error"
    );

    return;
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum);

    await provider.send("eth_requestAccounts", []);

    signer = await provider.getSigner();
    userAddress = await signer.getAddress();

    const network = await provider.getNetwork();
    const chainId = Number(network.chainId);

    if (chainId !== 11155111) {
      setNetworkStatus("Wrong Network", false);

      setStatus(
        "Please switch MetaMask to the Ethereum Sepolia network.",
        "warning"
      );

      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [
            {
              chainId: "0xaa36a7"
            }
          ]
        });

        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        userAddress = await signer.getAddress();
      } catch (switchError) {
        console.error("Unable to switch network:", switchError);

        setStatus(
          "Please manually switch your wallet to Ethereum Sepolia.",
          "warning"
        );

        return;
      }
    }

    initializeContracts();

    setButtonsConnected(true);
    setNetworkStatus("Sepolia", true);

    walletAddressElement.textContent = userAddress;

    setStatus("Wallet connected successfully.", "success");

    await refreshDashboard();
  } catch (error) {
    console.error("Wallet connection failed:", error);

    setStatus(
      getReadableError(error, "Unable to connect wallet."),
      "error"
    );
  }
}

function disconnectWallet() {
  provider = null;
  signer = null;
  userAddress = null;

  tokenContract = null;
  faucetContract = null;
  libraryContract = null;

  setButtonsConnected(false);
  setNetworkStatus("Disconnected", false);

  walletAddressElement.textContent = "No wallet connected";

  tokenBalanceElement.textContent = "— LIB";
  faucetBalanceElement.textContent = "— LIB";
  resourceCountElement.textContent = "—";

  resourceGrid.innerHTML = `
    <div class="empty-message">
      Connect your wallet to load library resources.
    </div>
  `;

  setStatus("Wallet disconnected.");
}

function initializeContracts() {
  tokenContract = new ethers.Contract(
    TOKEN_ADDRESS,
    TOKEN_ABI,
    signer
  );

  faucetContract = new ethers.Contract(
    FAUCET_ADDRESS,
    FAUCET_ABI,
    signer
  );

  libraryContract = new ethers.Contract(
    LIBRARY_ADDRESS,
    LIBRARY_ABI,
    signer
  );
}

function setupWalletListeners() {
  if (typeof window.ethereum === "undefined") {
    return;
  }

  window.ethereum.on("accountsChanged", async (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet();
      return;
    }

    await connectWallet();
  });

  window.ethereum.on("chainChanged", () => {
    window.location.reload();
  });
}

/* Dashboard                                                                   */

async function refreshDashboard() {
  if (!provider || !signer || !userAddress) {
    return;
  }

  try {
    await Promise.all([
      refreshBalances(),
      loadResources()
    ]);
  } catch (error) {
    console.error("Dashboard refresh failed:", error);

    setStatus(
      getReadableError(error, "Unable to refresh dashboard."),
      "error"
    );
  }
}

async function refreshBalances() {
  if (!tokenContract || !faucetContract) {
    return;
  }

  const [userBalance, faucetBalance] = await Promise.all([
    tokenContract.balanceOf(userAddress),
    tokenContract.balanceOf(FAUCET_ADDRESS)
  ]);

  tokenBalanceElement.textContent =
    `${formatTokenAmount(userBalance)} LIB`;

  faucetBalanceElement.textContent =
    `${formatTokenAmount(faucetBalance)} LIB`;
}

/* Resource loading                                                            */

async function loadResources() {
  if (!libraryContract || !userAddress) {
    return;
  }

  resourceGrid.innerHTML = `
    <div class="empty-message">
      Loading library resources...
    </div>
  `;

  try {
    const totalResources = await libraryContract.resourceCount();

    const resourceTotal = Number(totalResources);

    resourceCountElement.textContent = resourceTotal.toString();

    if (resourceTotal === 0) {
      resourceGrid.innerHTML = `
        <div class="empty-message">
          No resources have been added yet.
        </div>
      `;

      return;
    }

    const resources = [];

    for (let resourceId = 1; resourceId <= resourceTotal; resourceId++) {
      try {
        const resource = await libraryContract.getResource(resourceId);

        const [
          id,
          title,
          description,
          category,
          exists
        ] = resource;

        if (!exists) {
          continue;
        }

        let borrowed = false;

        try {
          borrowed = await libraryContract.userHasBorrowed(
            userAddress,
            resourceId
          );
        } catch (error) {
          borrowed = await libraryContract.hasBorrowed(
            userAddress,
            resourceId
          );
        }

        resources.push({
          id: Number(id),
          title,
          description,
          category,
          borrowed
        });
      } catch (error) {
        console.warn(
          `Unable to load resource ${resourceId}:`,
          error
        );
      }
    }

    renderResources(resources);
  } catch (error) {
    console.error("Unable to load resources:", error);

    resourceGrid.innerHTML = `
      <div class="empty-message">
        Unable to load resources. Please check your contract address and network.
      </div>
    `;

    throw error;
  }
}

function renderResources(resources) {
  if (!resources.length) {
    resourceGrid.innerHTML = `
      <div class="empty-message">
        No valid resources were found.
      </div>
    `;

    renderBorrowingHistory([]);
    return;
  }

  resourceGrid.innerHTML = resources
    .map((resource) => renderResourceCard(resource))
    .join("");

  document.querySelectorAll(".borrow-button").forEach((button) => {
    button.addEventListener("click", async () => {
      const resourceId = Number(button.dataset.resourceId);

      await borrowResource(resourceId, button);
    });
  });

  document.querySelectorAll(".read-button").forEach((button) => {
    button.addEventListener("click", () => {
      const resourceId = Number(button.dataset.readResourceId);

      showReader(resourceId);
    });
  });

  renderBorrowingHistory(resources);
}

function renderResourceCard(resource) {
  const borrowedClass = resource.borrowed ? "borrowed" : "";

  const borrowButton = resource.borrowed
    ? `
      <button
        class="read-button"
        data-read-resource-id="${resource.id}"
        type="button"
      >
        Read →
      </button>
    `
    : `
      <button
        class="borrow-button"
        data-resource-id="${resource.id}"
        type="button"
      >
        Borrow
      </button>
    `;

  const statusText = resource.borrowed
    ? "You have already borrowed this resource."
    : "";

  return `
    <article class="resource-card ${borrowedClass}">
      <div class="resource-cover">
        <span class="resource-category">
          ${escapeHTML(resource.category)}
        </span>

        <span class="resource-number">
          ${String(resource.id).padStart(2, "0")}
        </span>
      </div>

      <div class="resource-content">
        <h3>${escapeHTML(resource.title)}</h3>

        <p>${escapeHTML(resource.description)}</p>

        <div class="resource-footer">
          <span class="resource-cost">
            Cost: 1 LIB
          </span>

          ${borrowButton}
        </div>

        <p class="borrow-status">
          ${escapeHTML(statusText)}
        </p>
      </div>
    </article>
  `;
}

// borrowing history
function renderBorrowingHistory(resources) {
  if (!historyList) {
    return;
  }

  const borrowedResources = resources.filter(
    (resource) => resource.borrowed
  );

  if (!borrowedResources.length) {
    historyList.innerHTML = `
      <div class="history-empty">
        You have not borrowed any resources yet.
      </div>
    `;

    return;
  }

  historyList.innerHTML = borrowedResources
    .map(
      (resource) => `
        <div class="history-item">
          <div class="history-item-main">
            <div class="history-check">✓</div>

            <div>
              <h3>${escapeHTML(resource.title)}</h3>
              <p>${escapeHTML(resource.category)}</p>
            </div>
          </div>

          <button
            class="read-button"
            data-history-resource-id="${resource.id}"
            type="button"
          >
            Read →
          </button>
        </div>
      `
    )
    .join("");

  document
    .querySelectorAll("[data-history-resource-id]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const resourceId = Number(
          button.dataset.historyResourceId
        );

        showReader(resourceId);
      });
    });
}

function getTransactionLink(transactionHash) {
  return `
    <a
      class="transaction-link"
      href="https://sepolia.etherscan.io/tx/${transactionHash}"
      target="_blank"
      rel="noopener noreferrer"
    >
      View transaction on Sepolia Etherscan ↗
    </a>
  `;
}

function showReader(resourceId) {
  const resource = RESOURCE_CONTENT[resourceId];

  if (!resource) {
    setStatus("Reading content is not available for this resource.", "error");
    return;
  }

  readerTitle.textContent = resource.title;
  readerContent.innerHTML = resource.content;

  readerModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeReader() {
  readerModal.hidden = true;
  document.body.style.overflow = "";
}

/* Borrowing                                                                    */

async function borrowResource(resourceId, button) {
  if (!libraryContract || !userAddress) {
    setStatus("Please connect your wallet first.", "warning");
    return;
  }

  if (button) {
    button.disabled = true;
    button.textContent = "Confirm in wallet...";
  }

  setStatus(
    `Preparing to borrow resource ${resourceId}...`
  );

  try {
    const transaction = await libraryContract.borrowResource(resourceId);

    setStatus(
      `Transaction submitted.<br>${getTransactionLink(transaction.hash)}`
    );

    if (button) {
      button.textContent = "Confirming...";
    }

    await transaction.wait();

    setStatus(
      `Resource borrowed successfully. 1 LIB was transferred.<br> ${getTransactionLink(transaction.hash)}`,
      "success"
    );

    await refreshDashboard();
  } catch (error) {
    console.error("Borrow transaction failed:", error);

    if (button) {
      button.disabled = false;
      button.textContent = "Borrow";
    }

    setStatus(
      getReadableError(error, "Unable to borrow this resource."),
      "error"
    );
  }
}

/* Faucet                                                                      */

async function claimTokens() {
  if (!faucetContract || !userAddress) {
    setStatus("Please connect your wallet first.", "warning");
    return;
  }

  claimButton.disabled = true;
  claimButton.textContent = "Confirm in wallet...";

  setStatus("Preparing faucet claim...");

  try {
    const transaction = await faucetContract.claimTokens();

    setStatus(
      `Claim transaction submitted.<br>${getTransactionLink(transaction.hash)}`
    );

    claimButton.textContent = "Claiming...";

    await transaction.wait();

    setStatus(
      `Success! 5 LIB tokens were sent to your wallet.<br> ${getTransactionLink(transaction.hash)}`,
      "success"
    );

    claimButton.textContent = "Claimed 5 LIB";

    await refreshBalances();

    setTimeout(() => {
      if (claimButton) {
        claimButton.textContent = "Claim 5 LIB";
        claimButton.disabled = false;
      }
    }, 4000);
  } catch (error) {
    console.error("Token claim failed:", error);

    claimButton.textContent = "Claim 5 LIB";
    claimButton.disabled = false;

    setStatus(
      getReadableError(error, "Unable to claim tokens."),
      "error"
    );
  }
}

/* Error handling                                                              */

function getReadableError(error, fallbackMessage) {
  if (!error) {
    return fallbackMessage;
  }

  if (error.code === "ACTION_REJECTED") {
    return "Transaction was rejected in your wallet.";
  }

  if (error.code === "INSUFFICIENT_FUNDS") {
    return "You do not have enough Sepolia ETH to pay gas fees.";
  }

  if (error.reason) {
    return error.reason;
  }

  if (error.shortMessage) {
    return error.shortMessage;
  }

  if (error.info && error.info.error && error.info.error.message) {
    return error.info.error.message;
  }

  if (error.message) {
    if (error.message.includes("Please wait before claiming again")) {
      return "You must wait before claiming from the faucet again.";
    }

    if (error.message.includes("You already borrowed this resource")) {
      return "You have already borrowed this resource.";
    }

    if (error.message.includes("Faucet has insufficient tokens")) {
      return "The faucet does not have enough LIB tokens.";
    }

    if (error.message.includes("Resource does not exist")) {
      return "This resource does not exist.";
    }

    return error.message.slice(0, 180);
  }

  return fallbackMessage;
}

/* Event listeners                                                             */

if (connectButton) {
  connectButton.addEventListener("click", connectWallet);
}

if (heroConnectButton) {
  heroConnectButton.addEventListener("click", connectWallet);
}

if (disconnectButton) {
  disconnectButton.addEventListener("click", disconnectWallet);
}

if (claimButton) {
  claimButton.addEventListener("click", claimTokens);
}

if (closeReaderButton) {
  closeReaderButton.addEventListener("click", closeReader);
}

if (readerOverlay) {
  readerOverlay.addEventListener("click", closeReader);
}

setupWalletListeners();

/* Automatic connection if wallet is already connected                         */

async function initializeApp() {
  if (typeof window.ethereum === "undefined") {
    setNetworkStatus("Wallet Not Found", false);
    return;
  }

  try {
    provider = new ethers.BrowserProvider(window.ethereum);

    const accounts = await provider.send("eth_accounts", []);

    if (accounts.length > 0) {
      await connectWallet();
    }
  } catch (error) {
    console.error("Automatic wallet connection failed:", error);
  }
}

initializeApp(); 