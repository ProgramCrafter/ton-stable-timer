<script lang="ts">
    export let send_parameters : {
        destination: string,
        time: string,
        value_ton: string,
        message: string
    };
    export let deploy_parameters : {
        bounty_address: string
    };

    let dest_address = 'EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N';
    let bounty_address = 'EQCyoez1VF4HbNNq5Rbqfr3zKuoAjKorhK-YZr7LIIiVrSD7';
    let send_value = '1.6';
    let msg_content = '';
    let target_date_str = (new Date()).toISOString().slice(0, -8);    // initializing the field with current date

    $: send_parameters = {
        destination: dest_address, time: target_date_str + 'Z',
        value_ton: send_value.toString(), message: msg_content
    };
    $: deploy_parameters = {
        bounty_address: bounty_address
    };
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
      
      padding: 16px; margin: 8px;
      font-size: 15px;
    }
    .row {
      display: flex;
    }
    span {
      width: 100px;
      margin: 8px 8px;
      display: flex; align-items: center;
    }
    input {
      flex-grow: 1;
      margin: 8px 8px;
    }
    input.wide {
      flex-grow: 3;
    }

    div {
      word-break: break-all;
    }
</style>

<form>
    <p>Schedule message</p>
    <div class="row">
      <span>Destination</span><input class="wide" type="text" placeholder="www.ton" bind:value={dest_address}>
      <span>UTC datetime</span><input type="datetime-local" bind:value={target_date_str}>
    </div><div class="row">
      <span>Bounty* addr</span><input class="wide" type="text" placeholder="ratelance.ton" bind:value={bounty_address}>
      <span>Value (TON)</span><input type="number" placeholder="1.000000000"
                                    min="0.000000001" step="0.000000001" bind:value={send_value}>
    </div>
    <div class="row">
      <span>Message</span><input type="text" placeholder="TON Timer is a great service" bind:value={msg_content}>
    </div>
</form>