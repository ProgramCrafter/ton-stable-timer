<script>
  import TonWeb from '../node_modules/tonweb/dist/tonweb.js';

  const timer_code = 'te6ccgECCAEAAroAART/APSkE/S88sgLAQPk0wHQ0wMBcbCPZiHHAJJfA49dAdMfAYIQJOXxyrqPTAH6QDAB0x/UMO1E0PQE0z8BIlFCQxRHZts8FL7y4IxujoSIcPsA3oIQF9eEAHCAEMjLBVADzxYB+gLLiotkJvdW50eYzxbJcPsA7VSSXwPi4uMNAgcDAfbtRCT4I6EBggGGoPlBMFiAEvgz+Cj6RDABgCD0DG+hMIAo1yHTPwOoAtM/MFADqKABqKsPcFM1vI4SMDWCCC3GwFFCoRSoIRA1UEQDkTTiAqof+CWCEDuAAAGpCLFUQReAQPQ38uCqVBBDAsj0ABLLPwHPFskC+COhUiAEAexfA/gA7UTQ9ATTPwEC+CMhgED0h2+lnFMTArOSW3CTqx++4o4TAXD7AFiAQPRbMCCAQPSHb6UQNOhfAyBujiIwMXBwgBDIywVQA88WAfoCy4qLZCb3VudHmM8WyYEAoPsAjpICAsj0ABLLPwHPFsntVIhw+wDiBwGKAYIBhqD5QTBYgBL4M/go+kQwAYAg9AxvoTCAKNch0z8DqALTPzBQA6igAairD1ADoYIQBfXhAAGCEBfXhACgUAOgWKACBQHccAHQ0wABntMAAcAB8uBk+kAx+kAxjkcx0wIBc7Dy0G76QI0IZ/kBGCgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADDL6QFnHBfLQb/oA9AQBbvLgcPoAMfoAMeKAYNch0wAB4wDTADAwEqAGAJzTAAGOJdQB0NMAAZN11yHe0wABk3LXId7TAAGS1DHe0wABktQx3vQEMTCOIdMAAZN11yHe0wABk3LXId7TAAGS1DHe0wABktQx3vQEMeIAaGJ/kBGCgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgJiWgAAAAAAAAAAAAAAAAAAA=';
  
  export let margin = 4;
  export let delta_ms = 0;
  export let send_value = 0.000000001;

  let target_date_str = (new Date()).toISOString().slice(0, -8);    // initializing the field with current date
  $: target_time = new Date(target_date_str + 'Z');
  $: delta_ms = Math.max(0, target_time - Math.floor(new Date()));

  let msg_content = '';
  let address = '';
  let bounty_address = '';

  let timer_address = '';
  let init_boc = '';
  let main_message_boc = '';

  $: if (address) {
    try {
      let schedule_message = new TonWeb.boc.Cell();
      schedule_message.bits.writeUint(0x10, 6);
      schedule_message.bits.writeAddress(new TonWeb.Address(address));
      schedule_message.bits.writeCoins(TonWeb.utils.toNano('' + send_value));
      try {
        let msg_content_ref = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(msg_content));
        schedule_message.bits.writeUint(1, 107);
        schedule_message.refs.push(msg_content_ref);
      } catch {
        schedule_message.bits.writeUint(0, 139);
        schedule_message.bits.writeString(msg_content);
      }
      
      let main_message = new TonWeb.boc.Cell();
      main_message.bits.writeUint(0x24E5F1CA, 32);
      main_message.bits.writeUint(Math.ceil(+target_time / 1000), 32);
      main_message.refs.push(schedule_message);
      main_message.print();

      (async () => {
        main_message_boc = TonWeb.utils.bytesToBase64(await main_message.toBoc(false));
        console.warn(main_message_boc);
      })();
    } catch (e) {
      console.warn('Forming scheduling message failed', e);
    }
  }

  $: if (bounty_address) {
    try {
      let data_cell = new TonWeb.boc.Cell();
      data_cell.bits.writeUint(0, 1);
      data_cell.bits.writeUint(Math.ceil(new Date() / 1000), 64);
      data_cell.bits.writeAddress(new TonWeb.Address(bounty_address));

      let code_cell = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(timer_code));

      let init_cell = new TonWeb.boc.Cell();
      init_cell.bits.writeUint(6, 5);
      init_cell.refs.push(code_cell);
      init_cell.refs.push(data_cell);

      (async () => {
        init_boc = TonWeb.utils.bytesToBase64(await init_cell.toBoc(false));
        
        let hex_addr = '0:' + TonWeb.utils.bytesToHex(await init_cell.hash());
        timer_address = (new TonWeb.Address(hex_addr)).toString(true, true, true);
      })();
    } catch (e) {
      console.warn('Forming contract state failed', e);
    }
  }
</script>

<style>
  p {
    padding-bottom: 8px;
    border-bottom: 1px #232328 solid;
    margin-bottom: 8px;
    margin-top: 0;
    font-size: 22px;
  }
  form {
    border: 1px #232328 solid;
    border-radius: 4px;
    color: #046;
    
    padding: 16px;
    margin: var(--margin);
    font-size: 15px;
  }
  .row {
    display: flex;
  }
  span {
    width: 100px;
    margin: 8px 16px;
    display: flex; align-items: center;
  }
  input {
    flex-grow: 1;
    margin: 8px 16px;
  }
  input.wide {
    flex-grow: 2;
  }

  div {
    word-break: break-all;
  }
</style>

<form style="--margin: {margin}px;">
  <p>Schedule message</p>
  <div class="row">
    <span>Destination</span><input class="wide" type="text" placeholder="www.ton" bind:value={address}>
    <span>UTC datetime</span><input type="datetime-local" bind:value={target_date_str}>
  </div><div class="row">
    <span>Bounty* address</span><input class="wide" type="text" placeholder="ratelance.ton" bind:value={bounty_address}>
    <span>Value (TON)</span><input type="number" placeholder="1.000000000"
                                   min="0.000000001" step="0.000000001" bind:value={send_value}>
  </div>
  <div class="row">
    <span>Message</span><input type="text" placeholder="TON Timer is a great service" bind:value={msg_content}>
  </div>

  <div>Timer address: {timer_address}</div>
  <div>Init BOC: {init_boc}</div>
  <div>Msg BOC: {main_message_boc}</div>
</form>