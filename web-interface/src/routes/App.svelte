<svelte:head>
  <style>
    html {
      background: #a0dfff66;
      color: #232328;
    }
    body {
      background: #f7f9fb;
      width: 1020px; height: auto; min-height: calc(100% - 16px); box-sizing: content-box;
      margin: 0 auto;
      border-left: #b2d4fc 1px solid;
      border-right: #b2d4fc 1px solid;
    }
  </style>
</svelte:head>

<script lang="ts">
    import { load_timers } from '$lib/load_timers';
    import { make_deploy_message, make_join_message, substitute_values, type ExistingTimer, type MessageParamsCalc, type MessageParams } from '$lib/scheduler';
    import { onMount } from 'svelte';
    import Header from './Header.svelte'
    import HorizontalLine from './HorizontalLine.svelte'
    import SchedulePanel from './SchedulePanel.svelte';
    import Timer from './Timer.svelte';
    import QrPopup from './QRPopup.svelte';

    let is_testnet = false;
    let send_parameters_relaxed : {destination: string, time: string, value_ton: string, message: string};
    let deploy_parameters_relaxed : {bounty_address: string};

    let timers_promise : Promise<ExistingTimer[]> = load_timers();

    let join_message_promise : Promise<MessageParamsCalc> = Promise.reject("unavailable");
    let deploy_message_promise : Promise<MessageParams> = Promise.reject("unavailable");
    
    let popup_link = '';

    $: if (send_parameters_relaxed)
           join_message_promise = make_join_message(send_parameters_relaxed);
    $: if (send_parameters_relaxed && deploy_parameters_relaxed)
           deploy_message_promise = make_deploy_message(send_parameters_relaxed, deploy_parameters_relaxed);
</script>

<Header bind:is_testnet bind:popup_link />
<HorizontalLine margin={8} color={'#b2d4fc'} />

<SchedulePanel  bind:send_parameters={send_parameters_relaxed}
                bind:deploy_parameters={deploy_parameters_relaxed} />
<HorizontalLine margin={8} color={'#b2d4fc'} />

<!--
<p style="line-break: anywhere;">
    {#await join_message_promise}
        Calculating join message
    {:then a}
        Join message template: {console.log(a), a}
    {:catch b}
        Join message error: {b.toString()}
    {/await}
</p>
<p style="line-break: anywhere;">
    {#await deploy_message_promise}
        Calculating deploy message
    {:then a}
        Deploy message: {JSON.stringify(a)}
    {:catch b}
        Deploy message error: {b.toString()}
    {/await}
</p>

<HorizontalLine margin={8} color={'#b2d4fc'} />
-->

<Timer use_message_promise={deploy_message_promise} bind:popup_link />

{#await timers_promise}
    <span>Loading timers...</span>
{:then timers}
    {#each timers as timer}
        <Timer use_message_promise={
            join_message_promise.then(join_message => substitute_values(join_message, timer))
        } bind:popup_link />
    {/each}
{/await}

<HorizontalLine margin={8} color={'#b2d4fc'} />

<QrPopup bind:popup_link />
