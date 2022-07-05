import WalletConnect from "@walletconnect/client";
import {ITxData} from "@walletconnect/types"
import { AccountInfos } from "./AccountInfos";

export async function loadHomePage(connector: WalletConnect, parameters: AccountInfos) {
    const ethereumButton = document.querySelector('.enableEthereumButton');
    const sendEthButton = document.querySelector('.sendEthButton');


    let transaction: ITxData = {
        from: parameters.accounts[0],
        to: "0x2b857c8944fbba4d0a63f32bcb6daeb510289adb",
        value: "0x38d7ea4c68000",
        data: "0xe6985b3c0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000b6578616d706c652e636f6d000000000000000000000000000000000000000000",
    };

    console.log(connector.chainId, parameters.chainId)

    sendEthButton.addEventListener('click', () => {
        let res = connector.sendTransaction(transaction)
        console.log(res)
        return res
    });
}