<script>
  export let is_testnet = true;
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
    <img src="logo.png" class="icon" alt="TON Timer logo"><span>TON Timer</span>
  </div>
  <button class="greyout" disabled on:click={() => {is_testnet = !is_testnet;}}>
    <img class="icon" class:flip={is_testnet} src="https://ton.org/download/ton_symbol.svg" alt="TON logo" />
    <span>Now: {is_testnet ? 'testnet' : 'mainnet'}</span>
  </button>
  <div class="fill-space" />
  <span><a href="https://ton.org/">TON Foundation site</a></span>
  <span><a href="https://github.com/ProgramCrafter/ton-stable-timer/">Source code</a></span>
</header>
