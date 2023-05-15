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
  import HorizontalLine from './HorizontalLine.svelte';
  import SchedulePanel from './SchedulePanel.svelte';
  import InitInput from './InitInput.svelte';
  import Header from './Header.svelte';
  import Popup from './Popup.svelte';
  import Timer from './Timer.svelte';
  
  let popup_wrapper = null;

  let is_testnet = false;

  let delta_ms = 0;
  let send_value = 0;
</script>

<Header bind:is_testnet />
<HorizontalLine margin={8} color={'#b2d4fc'} />
<SchedulePanel margin={8} bind:delta_ms bind:send_value />
<HorizontalLine margin={8} color={'#b2d4fc'} />
<Timer margin={8} new_timer={true} {delta_ms} {send_value} />
<Timer margin={8} new_timer={false} {delta_ms} {send_value} />
<Timer margin={8} new_timer={false} {delta_ms} {send_value} />
<Popup bind:popup_wrapper />
