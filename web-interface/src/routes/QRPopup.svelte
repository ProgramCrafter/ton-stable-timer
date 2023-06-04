<script lang="ts">
    import QRCode from 'qrcode';
    
    export let popup_link = '';
    let canvas : HTMLCanvasElement;

    $: if (canvas) {
        if (popup_link) {
            QRCode.toCanvas(canvas, popup_link);
        } else {
            let ctx = canvas.getContext('2d')!;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 320, 320);
        }
    }
</script>

<style>
  .popup {
    position: fixed;
    left: 0; right: 0; top: 0; bottom: 0;
    background-color: #3338;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  .popup.empty {
    display: none; visibility: hidden;
  }
  canvas {
    width: 320px;
    height: 320px;
    border: #fff8 8px solid;
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="popup" class:empty={!popup_link} on:click={() => {popup_link = '';}}>
    <canvas bind:this={canvas} />
</div>
