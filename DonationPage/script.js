// ✅ Fixed recipient (NGO wallet address)

const RECIPIENT_ADDRESS = "0x1694a749B981D50a902AF1aFC260841E5DBe7B0f".toLowerCase();
 
// ✅ Backend endpoint

const BACKEND_NOTIFY = "http://localhost:3000/notify";
 
// ✅ DOM elements

const connectBtn = document.getElementById("connectBtn");

const payBtn = document.getElementById("payBtn");

const statusEl = document.getElementById("status");
 
let provider, signer, userAddress;
 
// ✅ Utility function — show messages

function setStatus(msg) {

  statusEl.textContent = msg;

  console.log(msg);

}
 
// ✅ Connect wallet function

async function connectWallet() {

  try {

    if (!window.ethereum) throw new Error("MetaMask not found.");
 
    await window.ethereum.request({ method: "eth_requestAccounts" });

    provider = new ethers.BrowserProvider(window.ethereum);

    signer = await provider.getSigner();

    userAddress = await signer.getAddress();
 
    connectBtn.textContent = `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;

    setStatus("Wallet connected ✅ (Sepolia network)");
 
    // Detect account change

    window.ethereum.on("accountsChanged", (accounts) => {

      if (accounts.length > 0) {

        userAddress = accounts[0];

        connectBtn.textContent = `Connected: ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`;

        setStatus("🔄 Account changed — new MetaMask account in use.");

      } else {

        setStatus("MetaMask disconnected.");

      }

    });

  } catch (err) {

    console.error(err);

    setStatus("Connect error: " + (err.message || err));

  }

}
 
connectBtn.addEventListener("click", connectWallet);
 
// ✅ Handle donation

document.getElementById("donationForm").addEventListener("submit", async (e) => {

  e.preventDefault();
 
  try {

    payBtn.disabled = true;

    setStatus("Preparing transaction...");
 
    if (!window.ethereum) throw new Error("MetaMask not found.");

    if (!signer) await connectWallet();
 
    const name = document.getElementById("name").value.trim();

    const phone = document.getElementById("phone").value.trim();

    const note = document.getElementById("note").value.trim();

    const amount = document.getElementById("amount").value.trim();
 
    if (!amount || Number(amount) <= 0) throw new Error("Enter a valid amount.");
 
    // --- Scale down for Sepolia testing (tiny ETH)

    const SCALE_FACTOR = 0.000001;

    const scaledAmount = Number(amount) * SCALE_FACTOR;

    const value = ethers.parseEther(scaledAmount.toString());
 
    setStatus(`Sending transaction via MetaMask... (scaled: ${scaledAmount} ETH)`);
 
    // ✅ Send donation to NGO wallet

    const txResponse = await signer.sendTransaction({

      to: RECIPIENT_ADDRESS,

      value

    });
 
    setStatus(`Transaction sent — waiting for confirmation...\nTx: ${txResponse.hash}`);
 
    const receipt = await txResponse.wait(1);

    if (!receipt || (receipt.status !== 1n && receipt.status !== 1 && receipt.status !== "0x1"))

      throw new Error("Transaction failed");
 
    // ✅ Success message

    const message = `

✅ Donation Successful!
 
👤 Name: ${name}

📱 Phone: ${phone}

💬 Message: ${note || "N/A"}

💰 Amount: ${amount} ETH

🔗 Transaction Hash:

${receipt.hash}

`;
 
    setStatus(message);

    alert(message);
 
    // ✅ Notify backend (send to MongoDB or server)

    const payload = { name, phone, note, amount, txHash: receipt.hash, from: userAddress, to: RECIPIENT_ADDRESS };

    const res = await fetch(BACKEND_NOTIFY, {

      method: "POST",

      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(payload)

    });
 
    const json = await res.json().catch(() => null);

    if (!res.ok) throw new Error((json && json.error) || `Notify failed (${res.status})`);
 
    setStatus(`✅ NGO notified successfully!\nTx: ${receipt.hash}`);
 
    // ✅ WhatsApp notification (auto-open)

    const whatsappNumber = "919373048440"; // include country code, no '+'

    const whatsappMsg = encodeURIComponent(

      `🎉 *New Donation!*\n\n👤 Name: ${name}\n📱 Phone: ${phone}\n💬 Message: ${note || "N/A"}\n💰 Amount: ${amount} ETH`

    );

    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMsg}`;

    window.open(whatsappURL, "_blank");
 
    // ✅ Optional button to re-open WhatsApp

    const whatsappBtn = document.createElement("button");

    whatsappBtn.textContent = "📱 View WhatsApp Message";

    whatsappBtn.style.backgroundColor = "#25D366";

    whatsappBtn.style.color = "white";

    whatsappBtn.style.border = "none";

    whatsappBtn.style.padding = "10px 16px";

    whatsappBtn.style.borderRadius = "8px";

    whatsappBtn.style.marginTop = "12px";

    whatsappBtn.style.cursor = "pointer";

    whatsappBtn.style.display = "block";

    whatsappBtn.addEventListener("click", () => window.open(whatsappURL, "_blank"));
 
    statusEl.appendChild(document.createElement("br"));

    statusEl.appendChild(whatsappBtn);
 
    // ✅ Reset form after success

    document.getElementById("donationForm").reset();

  } catch (err) {

    console.error(err);

    setStatus("Error: " + (err.message || err));

  } finally {

    payBtn.disabled = false;

  }

});

 