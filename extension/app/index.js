import { Buffer } from 'buffer';
import { loadWalletConnect } from "./loadWalletConnect"

// @ts-ignore
window.Buffer = Buffer;

loadWalletConnect()