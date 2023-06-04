<script lang="ts">
    import type { MessageParams } from "$lib/scheduler";
    import { sdk, is_tc2_connected } from "$lib/ton_connect";
    import { CHAIN } from "@tonconnect/sdk";
    
    export let use_message_promise : Promise<MessageParams>;
    export let is_testnet = true;
    
    let is_new_timer : boolean | null = null;
    let address : string | null = null;
    let cost : number | null = null;

    $: use_message_promise.then(use_message => {
        is_new_timer = use_message.stateInit != null;
        address = use_message.address;
        cost = +use_message.amount / 1e9;
    }).catch(() => {
        is_new_timer = null;
        address = null;
        cost = null;
    });

    async function use_timer() {
        let use_message = await use_message_promise;

        if (await is_tc2_connected()) {
            sdk!.sendTransaction({
                validUntil: Math.ceil(Date.now() / 1000 + 300),
                from: undefined,
                network: is_testnet ? CHAIN.TESTNET : CHAIN.MAINNET,
                messages: [use_message]
            });
        } else {
            let si = use_message.stateInit?.replaceAll('+', '-')?.replaceAll('/', '_');
            let url = 'ton://transfer/' + use_message.address
                    + '?amount=' + use_message.amount
                    + '&bin=' + use_message.payload.replaceAll('+', '-').replaceAll('/', '_')
                    + (si ? '&init=' + si : '');
            console.log(url);
        }
    }
</script>

<style>
  div {
    border: 1px #232328 solid;
    border-radius: 4px;
    
    padding: 16px; margin: 8px;
    font-size: 15px;
  }
  .nt {
    background: linear-gradient(4deg, #6AAEFF, #B2D4FC);
  }
  span {
    padding: 8px;
    padding-right: 12px;
  }
  span:not(:last-child) {
    border-right: 1px #046 solid;
  }
  button {
    background-color: #f7f9fb80;
    border-color: #232328; border-radius: 2px;
    width: 150px; margin: 0;
  }
  i {
    color: #046;
    font-size: 13px;
  }
</style>

{#if is_new_timer}
<div class="nt">
    <button on:click={use_timer}>Deploy new timer</button>
    <span><i>{address}</i></span>
    <span>Scheduling cost: {cost} TON <i>*with 0.4 returned</i></span>
</div>
{:else}
<div>
    <button on:click={use_timer}>Join existing timer</button>
    <span><i>{address}</i></span>
    <span>Scheduling cost: {cost} TON</span>
</div>
{/if}
