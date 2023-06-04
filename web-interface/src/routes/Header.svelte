<script>
    import { base } from "$app/paths";
    import { is_tc2_connected_init, request_connect, sdk } from "$lib/ton_connect";
  
    export let is_testnet = true;
    export let popup_link = '';
    let tc2_connected_promise = is_tc2_connected_init();  // : Promise<boolean>

    sdk?.onStatusChange(
        (wallet_object) => {
            tc2_connected_promise = sdk ? Promise.resolve(sdk.connected) : Promise.reject("sdk unavailable");
            if (wallet_object) popup_link = '';
        }
    );
    
    async function connect() {
        popup_link = await request_connect() ?? '';
    }
</script>

<style>
    header {
        display: flex;
        margin: 8px;
        margin-top: 0;
    }
    .icon {
        width: 28px; height: 28px;
        margin-right: 8px;
        display: inline-block;
        vertical-align: middle;
    }
    .logo>.icon {
        width: 40px; height: 40px;
        margin-right: 12px;
    }
    .greyout, .flip {
        filter: grayscale(1);
    }
    .flip {
        transform: scaleY(-1);
    }
    header>* {
        margin: 8px 16px;
    }
    button {
        height: 48px;
        border-radius: 16px;
        padding: 0 12px;
        margin: 4px 16px;
        background-color: #b2d4fc80;
        color: #232328;
        border: #ccc 1px solid;
        display: flex; align-items: center;
    }
    span {
        display: flex; align-items: center;
        color: #232328;
    }
    .fill-space {
        flex-grow: 1;
    }
    .logo>span {
        height: 100%;
        display: inline-block;
        font-weight: 800;
        font-size: 18px;
        margin-right: 16px;
        vertical-align: middle;
        line-height: 36px;
    }
</style>
  
<header>
    <div class="logo">
        <img src="{base}/logo.png" class="icon" alt="TON Timer logo"><span>TON Timer</span>
    </div>
    <button class="greyout" disabled on:click={() => {is_testnet = !is_testnet;}}>
        <img class="icon" class:flip={is_testnet} src="https://ton.org/download/ton_symbol.svg" alt="TON logo" />
        <span>Now: {is_testnet ? 'testnet' : 'mainnet'}</span>
    </button>
    <div class="fill-space" />
    <span><a href="https://ton.org/">TON Foundation site</a></span>
    <span><a href="https://github.com/ProgramCrafter/ton-stable-timer/">Source code</a></span>
    
    {#await tc2_connected_promise}
        <button class="greyout" disabled><span>Checking connection</span></button>
    {:then tc2_connected}
        {#if tc2_connected}
            <button on:click={() => {sdk?.disconnect();}}><span>Disconnect wallet</span></button>
        {:else}
            <button on:click={connect}><span>Connect wallet</span></button>
        {/if}
    {/await}
</header>
  