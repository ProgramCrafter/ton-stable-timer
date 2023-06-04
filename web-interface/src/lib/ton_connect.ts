import TonConnect, { type WalletInfoRemote } from "@tonconnect/sdk";
import { tc2_manifest_url } from "./consts.js";


export let sdk : TonConnect | null = null;

function ensure_sdk() : TonConnect {
    if (sdk == null) {
        sdk = new TonConnect({manifestUrl: tc2_manifest_url})
    }
    return sdk;
}

export async function is_tc2_connected_init() : Promise<boolean> {
    let sdk = ensure_sdk();
    await sdk.restoreConnection();
    return sdk.connected;
}

export async function request_connect() : Promise<string | null> {
    let sdk = ensure_sdk();
    if (sdk.connected) return null;

    let wallets = await sdk.getWallets();
    let tonkeeper = wallets[0] as WalletInfoRemote;

    let url = sdk.connect({bridgeUrl: tonkeeper.bridgeUrl, universalLink: tonkeeper.universalLink});
    console.log('TON Connect 2 link:', url);
    return url;
}
