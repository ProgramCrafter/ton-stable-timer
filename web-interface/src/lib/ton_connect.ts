import TonConnect, { type WalletInfoRemote } from "@tonconnect/sdk";
import { tc2_manifest_url } from "./consts.js";


export let sdk : TonConnect | null = null;

function ensure_sdk() : TonConnect {
    if (sdk == null) {
        sdk = new TonConnect({manifestUrl: tc2_manifest_url})
    }
    return sdk;
}

export async function is_tc2_connected() : Promise<boolean> {
    let sdk = ensure_sdk();
    await sdk.restoreConnection();
    return sdk.connected;
}

export async function console_connect() {
    let sdk = ensure_sdk();
    if (sdk.connected) return;

    let wallets = await sdk.getWallets();
    let tonkeeper = wallets[0] as WalletInfoRemote;

    console.log(tonkeeper);
    console.log(sdk.connect({bridgeUrl: tonkeeper.bridgeUrl, universalLink: tonkeeper.universalLink}));
}
