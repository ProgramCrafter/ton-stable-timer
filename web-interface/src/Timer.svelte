<script>
  export let margin = 4;

  export let contract_info = {
    address: 'EQCyoez1VF4HbNNq5Rbqfr3zKuoAjKorhK-YZr7LIIiVrSD7',
    balance: -1,
    activate_link: ''
  };

  export let delta_ms = 0;
  export let send_value = 0;

  $: cost = delta_ms * 3 / 1e6 + 0.6 + send_value;
  $: cost_nton = Math.ceil(cost * 1e9);
  $: cost_rounded = (cost_nton - (contract_info.balance == -1 ? 400000000 : 0)) / 1e9;

  $: full_activate_link = contract_info.activate_link
       .replace('{}', contract_info.address)
       .replace('{}', '' + cost_nton);
</script>

<style>
  div {
    border: 1px #232328 solid;
    border-radius: 4px;
    
    padding: 16px;
    margin: var(--margin);
    font-size: 15px;
  }
  .nt {
    background: linear-gradient(4deg, #6AAEFF, #B2D4FC);
  }
  span {
    padding: 8px;
  }
  span:not(:last-child) {
    border-right: 1px #046 solid;
  }
</style>

<div style="--margin: {margin}px;" class:nt={contract_info.balance == -1}>
  {#if contract_info.balance == -1}
    <span><a href={full_activate_link}>[Deploy]</a> new timer
          {contract_info.address}
    </span>
  {:else}
    <span><a href={full_activate_link}>[Join]</a> timer
          <a href="https://tonscan.org/address/{contract_info.address}">{contract_info.address}</a>
    </span>
    <span>Stored value: {contract_info.balance / 1e9} TON</span>
  {/if}

  <span>Scheduling cost: {cost_rounded} TON{#if contract_info.balance == -1}*{/if}</span>
</div>
