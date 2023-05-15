<script>
  export let new_timer = true;
  export let margin = 4;

  export let timer_address = 'EQCyoez1VF4HbNNq5Rbqfr3zKuoAjKorhK-YZr7LIIiVrSD7';
  export let delta_ms = 0;
  export let send_value = 0;

  $: cost = delta_ms * 3 / 1e6 + (new_timer ? 0.2 : 0.6) + send_value;
  $: cost_rounded = Math.ceil(cost * 1e9) / 1e9;
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

<div style="--margin: {margin}px;" class:nt={new_timer}>
  {#if new_timer}
  <span>
    Deploy new timer
    <a href="https://tonscan.org/address/{timer_address}">{timer_address}</a>
  </span>
  {:else}
  <span>
    Join timer
    <a href="https://tonscan.org/address/{timer_address}">{timer_address}</a>
  </span>
  {/if}
  <span>
    cost: {cost_rounded} TON{#if new_timer}*{/if}
  </span>
</div>
