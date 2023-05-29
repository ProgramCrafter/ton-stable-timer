<svelte:head>
  <style>
    html {
      background: #f7f9fb;
      color: #232328;
      font-family: Roboto, sans-serif;
    }
  </style>
</svelte:head>

<script>
  import { getHttpEndpoint } from "../node_modules/@orbs-network/ton-access/lib/index.js";
  import TonWeb from '../node_modules/tonweb/dist/tonweb.js';

  import HorizontalLine from './HorizontalLine.svelte';
  import SchedulePanel from './SchedulePanel.svelte';
  import Header from './Header.svelte';
  import Popup from './Popup.svelte';
  import Timer from './Timer.svelte';
  
  let popup_wrapper = null;

  let is_testnet = false;

  let delta_ms = 0;
  let send_value = 0;

  let new_timer = {address: '', balance: -1, activate_link: ''};
  let timer_join_link = '';
  let timer_code;

  let timers = [];
  // {address: 'EQCx2NpikmgbUX7TJ_JqM-DtAOwFCR1FaATwT0lZ1UI4Ed6Z', balance: 9.6e9, activate_link: ''}

  const gql_request = `
  query {
    transactions(
      address_friendly: "Ef8gIwUCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASB6"
      page_size: 50
      page: 0
    ) {
      in_msg_src_addr_workchain_id
      in_msg_src_addr_address_hex
      in_msg_value_grams
      gen_utime
    }
  }
`;

  (async () => {
    const endpoint = await getHttpEndpoint();
    const provider = new TonWeb.HttpProvider(endpoint);

    const tx_list_response = await fetch('https://dton.io/graphql/', {
      method: 'POST',
      body: JSON.stringify({query: gql_request}),
      headers: {'Content-Type': 'application/json'}
    });
    const tx_list = (await tx_list_response.json()).data.transactions;

    let seen_timers = {timer_bounce_addr: true};
    for (let tx of tx_list) {
      const src_addr_hex = tx.in_msg_src_addr_workchain_id + ':' + tx.in_msg_src_addr_address_hex;
      const src_addr = (new TonWeb.Address(src_addr_hex)).toString(true, true, true);

      if (seen_timers[src_addr_hex]) continue;
      seen_timers[src_addr_hex] = true;

      const timer_state = await provider.getAddressInfo(src_addr);

      if (timer_state.state == 'uninitialized') {
        console.log('Found deactivated timer', src_addr);
        // continue;
      } else if (timer_state.code != timer_code) {
        console.warn('Possible fraud attempt: contract with code != timer', src_addr);
        continue;
      }

      timers.push({'address': src_addr, 'balance': timer_state.balance, 'activate_link': ''});
    }

    timers = timers;
  })();

  $: if (timers.length && timer_join_link.length) {
    for (let timer of timers) {
      timer.activate_link = timer_join_link;
    }
  }
</script>

<Header bind:is_testnet />
<HorizontalLine margin={8} color={'#b2d4fc'} />
<div style="margin: 8px; padding: 16px; background-color: #f408; font-size: 22px; color: #800;">
  THIS UI MUST NOT BE USED DIRECTLY | IT DOES NOT REFLECT REAL BLOCKCHAIN STATE CORRECTLY
</div>
<HorizontalLine margin={8} color={'#b2d4fc'} />
<SchedulePanel margin={8} bind:delta_ms bind:send_value bind:timer_join_link
                          bind:new_timer bind:timer_code/>
<HorizontalLine margin={8} color={'#b2d4fc'} />
<Timer margin={8} contract_info={new_timer} {delta_ms} {send_value} />
{#each timers as timer}
  <Timer margin={8} contract_info={timer} {delta_ms} {send_value} />
{/each}
<Popup bind:popup_wrapper />
