import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";
import { AccountInfos } from "./AccountInfos";
import { loadHomePage } from "./homepage"

export function loadWalletConnect() {
    const connector = new WalletConnect(
        {
            bridge: "https://bridge.walletconnect.org", // Required
            qrcodeModal: QRCodeModal,
        }
    );

    // Check if connection is already established
    if (!connector.connected) {
        // create new session
        connector.createSession();
    }

    // Subscribe to connection events
    connector.on("connect", (error, payload) => {
        if (error) {
            throw error;
        }

        loadHomePage(connector, payload.params[0] as AccountInfos)
    });

    connector.on("session_update", (error, payload) => {
        if (error) {
            throw error;
        }

        // Get updated accounts and chainId
        const { accounts, chainId } = payload.params[0];
        console.log("session_update", payload)
    });

    connector.on("disconnect", (error, payload) => {
        if (error) {
            throw error;
        }

        // Delete connector
        console.log("disconnect", payload)
    });

}