import { c as create_ssr_component, e as escape, i as is_promise, n as noop, d as add_attribute, v as validate_component, f as each } from "../../chunks/index.js";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import TonWeb from "tonweb";
import { b as base } from "../../chunks/paths.js";
import TonConnect from "@tonconnect/sdk";
import "qrcode";
const timers_gql_request = `
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
const timer_code = "te6ccgECCAEAAroAART/APSkE/S88sgLAQPk0wHQ0wMBcbCPZiHHAJJfA49dAdMfAYIQJOXxyrqPTAH6QDAB0x/UMO1E0PQE0z8BIlFCQxRHZts8FL7y4IxujoSIcPsA3oIQF9eEAHCAEMjLBVADzxYB+gLLiotkJvdW50eYzxbJcPsA7VSSXwPi4uMNAgcDAfbtRCT4I6EBggGGoPlBMFiAEvgz+Cj6RDABgCD0DG+hMIAo1yHTPwOoAtM/MFADqKABqKsPcFM1vI4SMDWCCC3GwFFCoRSoIRA1UEQDkTTiAqof+CWCEDuAAAGpCLFUQReAQPQ38uCqVBBDAsj0ABLLPwHPFskC+COhUiAEAexfA/gA7UTQ9ATTPwEC+CMhgED0h2+lnFMTArOSW3CTqx++4o4TAXD7AFiAQPRbMCCAQPSHb6UQNOhfAyBujiIwMXBwgBDIywVQA88WAfoCy4qLZCb3VudHmM8WyYEAoPsAjpICAsj0ABLLPwHPFsntVIhw+wDiBwGKAYIBhqD5QTBYgBL4M/go+kQwAYAg9AxvoTCAKNch0z8DqALTPzBQA6igAairD1ADoYIQBfXhAAGCEBfXhACgUAOgWKACBQHccAHQ0wABntMAAcAB8uBk+kAx+kAxjkcx0wIBc7Dy0G76QI0IZ/kBGCgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADDL6QFnHBfLQb/oA9AQBbvLgcPoAMfoAMeKAYNch0wAB4wDTADAwEqAGAJzTAAGOJdQB0NMAAZN11yHe0wABk3LXId7TAAGS1DHe0wABktQx3vQEMTCOIdMAAZN11yHe0wABk3LXId7TAAGS1DHe0wABktQx3vQEMeIAaGJ/kBGCgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgJiWgAAAAAAAAAAAAAAAAAAA=";
const tc2_manifest_url = "https://programcrafter.github.io/ton-stable-timer/tonconnect-manifest.json";
async function load_timers(is_testnet = false) {
  if (is_testnet) {
    throw new Error("testnet not implemented");
  }
  const endpoint = await getHttpEndpoint();
  const provider = new TonWeb.HttpProvider(endpoint);
  const tx_list_response = await fetch("https://dton.io/graphql/", {
    method: "POST",
    body: JSON.stringify({ query: timers_gql_request }),
    headers: { "Content-Type": "application/json" }
  });
  const tx_list = (await tx_list_response.json()).data.transactions;
  const wanted_code_cell = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(timer_code));
  const wanted_code_hash = TonWeb.utils.bytesToHex(await wanted_code_cell.hash());
  let timers_list = [];
  let seen_timers = /* @__PURE__ */ new Map();
  for (let tx of tx_list) {
    const src_addr_hex = tx.in_msg_src_addr_workchain_id + ":" + tx.in_msg_src_addr_address_hex;
    const src_addr = new TonWeb.Address(src_addr_hex).toString(true, true, true);
    if (seen_timers.has(src_addr_hex))
      continue;
    seen_timers.set(src_addr_hex, true);
    const timer_state = await provider.getAddressInfo(src_addr);
    if (timer_state.state == "uninitialized") {
      console.log("Found deactivated timer", src_addr);
      continue;
    } else {
      if (timer_state.code != timer_code) {
        const code_cell = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(timer_state.code));
        const code_hash = TonWeb.utils.bytesToHex(await code_cell.hash());
        if (code_hash != wanted_code_hash) {
          console.warn("Possible fraud attempt: contract with code != timer", src_addr);
          continue;
        }
      }
      let timer_data = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(timer_state.data));
      let timer_data_shifted = new TonWeb.boc.Cell();
      timer_data_shifted.bits.writeUint(0, 7);
      timer_data_shifted.writeCell(timer_data);
      let end_timestamp = TonWeb.utils.readNBytesUIntFromArray(
        8,
        timer_data_shifted.bits.array.slice(1)
      );
      timers_list.push({
        address: src_addr,
        time_limit: new Date(end_timestamp * 1e3)
      });
    }
  }
  return timers_list;
}
function substitute_values(base2, contract) {
  let dt = BigInt(Math.ceil(Math.max(0, +base2.amount.time_limit - +contract.time_limit) / 1e3));
  return {
    address: contract.address,
    stateInit: void 0,
    payload: base2.payload,
    amount: "" + (base2.amount.base_amount + base2.amount.add_per_second * dt)
  };
}
async function make_join_message(send_parameters) {
  if (+send_parameters.value_ton < 0.1) {
    throw new Error("send requires >= 0.1 TON");
  }
  let schedule_message = new TonWeb.boc.Cell();
  schedule_message.bits.writeUint(16, 6);
  schedule_message.bits.writeAddress(new TonWeb.Address(send_parameters.destination));
  schedule_message.bits.writeCoins(TonWeb.utils.toNano(send_parameters.value_ton));
  try {
    let msg_content_ref = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(send_parameters.message));
    schedule_message.bits.writeUint(1, 107);
    schedule_message.refs.push(msg_content_ref);
  } catch {
    schedule_message.bits.writeUint(0, 139);
    schedule_message.bits.writeString(send_parameters.message);
  }
  let main_message = new TonWeb.boc.Cell();
  main_message.bits.writeUint(619049418, 32);
  main_message.bits.writeUint(Math.ceil(+new Date(send_parameters.time) / 1e3), 32);
  main_message.refs.push(schedule_message);
  main_message.print();
  let main_message_boc = await main_message.toBoc(false);
  return {
    amount: {
      base_amount: 600n * 1000000n + BigInt(+send_parameters.value_ton * 1e9),
      add_per_second: 3000000n,
      // 3 milliTON/s
      time_limit: new Date(send_parameters.time)
    },
    payload: TonWeb.utils.bytesToBase64(main_message_boc)
  };
}
async function make_deploy_message(send_parameters, deploy_parameters) {
  let join_message = await make_join_message(send_parameters);
  let data_cell = new TonWeb.boc.Cell();
  data_cell.bits.writeUint(0, 1);
  data_cell.bits.writeUint(Math.ceil(+/* @__PURE__ */ new Date() / 1e3), 64);
  data_cell.bits.writeAddress(new TonWeb.Address(deploy_parameters.bounty_address));
  let code_cell = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(timer_code));
  let init_cell = new TonWeb.boc.Cell();
  init_cell.bits.writeUint(6, 5);
  init_cell.refs.push(code_cell);
  init_cell.refs.push(data_cell);
  let hex_addr = "0:" + TonWeb.utils.bytesToHex(await init_cell.hash());
  let new_timer_address = new TonWeb.Address(hex_addr).toString(true, true, true);
  let deploy_message = substitute_values(
    join_message,
    { address: new_timer_address, time_limit: /* @__PURE__ */ new Date() }
  );
  deploy_message.stateInit = TonWeb.utils.bytesToBase64(await init_cell.toBoc(false));
  return deploy_message;
}
let sdk = null;
function ensure_sdk() {
  if (sdk == null) {
    sdk = new TonConnect({ manifestUrl: tc2_manifest_url });
  }
  return sdk;
}
async function is_tc2_connected_init() {
  let sdk2 = ensure_sdk();
  await sdk2.restoreConnection();
  return sdk2.connected;
}
const Header_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: "header.svelte-1yoiiv0.svelte-1yoiiv0{display:flex;margin:8px;margin-top:0}.icon.svelte-1yoiiv0.svelte-1yoiiv0{width:28px;height:28px;margin-right:8px;display:inline-block;vertical-align:middle}.logo.svelte-1yoiiv0>.icon.svelte-1yoiiv0{width:40px;height:40px;margin-right:12px}.greyout.svelte-1yoiiv0.svelte-1yoiiv0,.flip.svelte-1yoiiv0.svelte-1yoiiv0{filter:grayscale(1)}.flip.svelte-1yoiiv0.svelte-1yoiiv0{transform:scaleY(-1)}header.svelte-1yoiiv0>.svelte-1yoiiv0{margin:8px 16px}button.svelte-1yoiiv0.svelte-1yoiiv0{height:48px;border-radius:16px;padding:0 12px;margin:4px 16px;background-color:#b2d4fc80;color:#232328;border:#ccc 1px solid;display:flex;align-items:center}span.svelte-1yoiiv0.svelte-1yoiiv0{display:flex;align-items:center;color:#232328}.fill-space.svelte-1yoiiv0.svelte-1yoiiv0{flex-grow:1}.logo.svelte-1yoiiv0>span.svelte-1yoiiv0{height:100%;display:inline-block;font-weight:800;font-size:18px;margin-right:16px;vertical-align:middle;line-height:36px}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { is_testnet = true } = $$props;
  let { popup_link = "" } = $$props;
  let tc2_connected_promise = is_tc2_connected_init();
  sdk?.onStatusChange((wallet_object) => {
    tc2_connected_promise = sdk ? Promise.resolve(sdk.connected) : Promise.reject("sdk unavailable");
    if (wallet_object)
      popup_link = "";
  });
  if ($$props.is_testnet === void 0 && $$bindings.is_testnet && is_testnet !== void 0)
    $$bindings.is_testnet(is_testnet);
  if ($$props.popup_link === void 0 && $$bindings.popup_link && popup_link !== void 0)
    $$bindings.popup_link(popup_link);
  $$result.css.add(css$4);
  return `<header class="svelte-1yoiiv0"><div class="logo svelte-1yoiiv0"><img src="${escape(base, true) + "/logo.png"}" class="icon svelte-1yoiiv0" alt="TON Timer logo"><span class="svelte-1yoiiv0">TON Timer</span></div>
    <button class="greyout svelte-1yoiiv0" disabled><img class="${["icon svelte-1yoiiv0", is_testnet ? "flip" : ""].join(" ").trim()}" src="https://ton.org/download/ton_symbol.svg" alt="TON logo">
        <span class="svelte-1yoiiv0">Now: ${escape(is_testnet ? "testnet" : "mainnet")}</span></button>
    <div class="fill-space svelte-1yoiiv0"></div>
    <span class="svelte-1yoiiv0"><a href="https://ton.org/">TON Foundation site</a></span>
    <span class="svelte-1yoiiv0"><a href="https://github.com/ProgramCrafter/ton-stable-timer/">Source code</a></span>
    
    ${function(__value) {
    if (is_promise(__value)) {
      __value.then(null, noop);
      return `
        <button class="greyout svelte-1yoiiv0" disabled><span class="svelte-1yoiiv0">Checking connection</span></button>
    `;
    }
    return function(tc2_connected) {
      return `
        ${tc2_connected ? `<button class="svelte-1yoiiv0"><span class="svelte-1yoiiv0">Disconnect wallet</span></button>` : `<button class="svelte-1yoiiv0"><span class="svelte-1yoiiv0">Connect wallet</span></button>`}
    `;
    }(__value);
  }(tc2_connected_promise)}</header>`;
});
const HorizontalLine_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: "div.svelte-6a3pxo{height:1px;border-top:var(--color) 1px solid;margin:var(--margin)}",
  map: null
};
const HorizontalLine = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { margin = 4 } = $$props;
  let { color = "grey" } = $$props;
  if ($$props.margin === void 0 && $$bindings.margin && margin !== void 0)
    $$bindings.margin(margin);
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  $$result.css.add(css$3);
  return `<div style="${"--margin: " + escape(margin, true) + "px; --color: " + escape(color, true) + ";"}" class="svelte-6a3pxo"></div>`;
});
const SchedulePanel_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: "p.svelte-1aa3dcg{padding-bottom:8px;border-bottom:1px #232328 solid;margin-bottom:8px;margin-top:0;font-size:22px}form.svelte-1aa3dcg{border:1px #232328 solid;border-radius:4px;color:#046;padding:16px;margin:8px;font-size:15px}.row.svelte-1aa3dcg{display:flex}span.svelte-1aa3dcg{width:100px;margin:8px 8px;display:flex;align-items:center}input.svelte-1aa3dcg{flex-grow:1;margin:8px 8px}input.wide.svelte-1aa3dcg{flex-grow:3}div.svelte-1aa3dcg{word-break:break-all}",
  map: null
};
const SchedulePanel = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { send_parameters } = $$props;
  let { deploy_parameters } = $$props;
  let dest_address = "EQCD39VS5jcptHL8vMjEXrzGaRcCVYto7HUn4bpAOg8xqB2N";
  let bounty_address = "EQCyoez1VF4HbNNq5Rbqfr3zKuoAjKorhK-YZr7LIIiVrSD7";
  let send_value = "1.6";
  let msg_content = "";
  let target_date_str = /* @__PURE__ */ (/* @__PURE__ */ new Date()).toISOString().slice(0, -8);
  if ($$props.send_parameters === void 0 && $$bindings.send_parameters && send_parameters !== void 0)
    $$bindings.send_parameters(send_parameters);
  if ($$props.deploy_parameters === void 0 && $$bindings.deploy_parameters && deploy_parameters !== void 0)
    $$bindings.deploy_parameters(deploy_parameters);
  $$result.css.add(css$2);
  send_parameters = {
    destination: dest_address,
    time: target_date_str + "Z",
    value_ton: send_value.toString(),
    message: msg_content
  };
  deploy_parameters = { bounty_address };
  return `<form class="svelte-1aa3dcg"><p class="svelte-1aa3dcg">Schedule message</p>
    <div class="row svelte-1aa3dcg"><span class="svelte-1aa3dcg">Destination</span><input class="wide svelte-1aa3dcg" type="text" placeholder="www.ton"${add_attribute("value", dest_address, 0)}>
      <span class="svelte-1aa3dcg">UTC datetime</span><input type="datetime-local" class="svelte-1aa3dcg"${add_attribute("value", target_date_str, 0)}>
    </div><div class="row svelte-1aa3dcg"><span class="svelte-1aa3dcg">Bounty* addr</span><input class="wide svelte-1aa3dcg" type="text" placeholder="ratelance.ton"${add_attribute("value", bounty_address, 0)}>
      <span class="svelte-1aa3dcg">Value (TON)</span><input type="number" placeholder="1.000000000 (min 1 TON)" min="0.1" step="0.000000001" class="svelte-1aa3dcg"${add_attribute("value", send_value, 0)}></div>
    <div class="row svelte-1aa3dcg"><span class="svelte-1aa3dcg">Message</span><input type="text" placeholder="TON Timer is a great service" class="svelte-1aa3dcg"${add_attribute("value", msg_content, 0)}></div></form>`;
});
const Timer_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: "div.svelte-1hsad7c{border:1px #232328 solid;border-radius:4px;padding:16px;margin:8px;font-size:15px}.nt.svelte-1hsad7c{background:linear-gradient(4deg, #6AAEFF, #B2D4FC)}span.svelte-1hsad7c{padding:8px;padding-right:12px}span.svelte-1hsad7c:not(:last-child){border-right:1px #046 solid}button.svelte-1hsad7c{background-color:#f7f9fb80;border-color:#232328;border-radius:2px;width:150px;margin:0}i.svelte-1hsad7c{color:#046;font-size:13px}",
  map: null
};
const Timer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { use_message_promise } = $$props;
  let { is_testnet = true } = $$props;
  let { popup_link = "" } = $$props;
  let is_new_timer = null;
  let address = null;
  let cost = null;
  if ($$props.use_message_promise === void 0 && $$bindings.use_message_promise && use_message_promise !== void 0)
    $$bindings.use_message_promise(use_message_promise);
  if ($$props.is_testnet === void 0 && $$bindings.is_testnet && is_testnet !== void 0)
    $$bindings.is_testnet(is_testnet);
  if ($$props.popup_link === void 0 && $$bindings.popup_link && popup_link !== void 0)
    $$bindings.popup_link(popup_link);
  $$result.css.add(css$1);
  {
    use_message_promise.then((use_message) => {
      is_new_timer = use_message.stateInit != null;
      address = use_message.address;
      cost = +use_message.amount / 1e9;
    }).catch(() => {
      is_new_timer = null;
      address = null;
      cost = null;
    });
  }
  return `${is_new_timer ? `<div class="nt svelte-1hsad7c"><button class="svelte-1hsad7c">Deploy new timer</button>
    <span class="svelte-1hsad7c"><i class="svelte-1hsad7c">${escape(address)}</i></span>
    <span class="svelte-1hsad7c">Scheduling cost: ${escape(cost)} TON <i class="svelte-1hsad7c">*with 0.4 returned</i></span></div>` : `<div class="svelte-1hsad7c"><button class="svelte-1hsad7c">Join existing timer</button>
    <span class="svelte-1hsad7c"><i class="svelte-1hsad7c">${escape(address)}</i></span>
    <span class="svelte-1hsad7c">Scheduling cost: ${escape(cost)} TON</span></div>`}`;
});
const QRPopup_svelte_svelte_type_style_lang = "";
const css = {
  code: ".popup.svelte-56nh8c{position:fixed;left:0;right:0;top:0;bottom:0;background-color:#3338;display:flex;align-items:center;justify-content:center}.popup.empty.svelte-56nh8c{display:none;visibility:hidden}canvas.svelte-56nh8c{width:320px;height:320px;border:#fff8 8px solid}",
  map: null
};
const QRPopup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { popup_link = "" } = $$props;
  let canvas;
  if ($$props.popup_link === void 0 && $$bindings.popup_link && popup_link !== void 0)
    $$bindings.popup_link(popup_link);
  $$result.css.add(css);
  return `
<div class="${["popup svelte-56nh8c", !popup_link ? "empty" : ""].join(" ").trim()}"><canvas class="svelte-56nh8c"${add_attribute("this", canvas, 0)}></canvas></div>`;
});
const App = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let is_testnet = false;
  let send_parameters_relaxed;
  let deploy_parameters_relaxed;
  let timers_promise = load_timers();
  let join_message_promise = Promise.reject("unavailable");
  let deploy_message_promise = Promise.reject("unavailable");
  let popup_link = "";
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    {
      if (send_parameters_relaxed)
        join_message_promise = make_join_message(send_parameters_relaxed);
    }
    {
      if (send_parameters_relaxed && deploy_parameters_relaxed)
        deploy_message_promise = make_deploy_message(send_parameters_relaxed, deploy_parameters_relaxed);
    }
    $$rendered = `${$$result.head += `<!-- HEAD_svelte-t3ifu7_START --><style>html {
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
  </style><!-- HEAD_svelte-t3ifu7_END -->`, ""}



${validate_component(Header, "Header").$$render(
      $$result,
      { is_testnet, popup_link },
      {
        is_testnet: ($$value) => {
          is_testnet = $$value;
          $$settled = false;
        },
        popup_link: ($$value) => {
          popup_link = $$value;
          $$settled = false;
        }
      },
      {}
    )}
${validate_component(HorizontalLine, "HorizontalLine").$$render($$result, { margin: 8, color: "#b2d4fc" }, {}, {})}

${validate_component(SchedulePanel, "SchedulePanel").$$render(
      $$result,
      {
        send_parameters: send_parameters_relaxed,
        deploy_parameters: deploy_parameters_relaxed
      },
      {
        send_parameters: ($$value) => {
          send_parameters_relaxed = $$value;
          $$settled = false;
        },
        deploy_parameters: ($$value) => {
          deploy_parameters_relaxed = $$value;
          $$settled = false;
        }
      },
      {}
    )}
${validate_component(HorizontalLine, "HorizontalLine").$$render($$result, { margin: 8, color: "#b2d4fc" }, {}, {})}



${validate_component(Timer, "Timer").$$render(
      $$result,
      {
        use_message_promise: deploy_message_promise,
        popup_link
      },
      {
        popup_link: ($$value) => {
          popup_link = $$value;
          $$settled = false;
        }
      },
      {}
    )}

${function(__value) {
      if (is_promise(__value)) {
        __value.then(null, noop);
        return `
    <span>Loading timers...</span>
`;
      }
      return function(timers) {
        return `
    ${each(timers, (timer) => {
          return `${validate_component(Timer, "Timer").$$render(
            $$result,
            {
              use_message_promise: join_message_promise.then((join_message) => substitute_values(join_message, timer)),
              popup_link
            },
            {
              popup_link: ($$value) => {
                popup_link = $$value;
                $$settled = false;
              }
            },
            {}
          )}`;
        })}
`;
      }(__value);
    }(timers_promise)}

${validate_component(HorizontalLine, "HorizontalLine").$$render($$result, { margin: 8, color: "#b2d4fc" }, {}, {})}

${validate_component(QRPopup, "QrPopup").$$render(
      $$result,
      { popup_link },
      {
        popup_link: ($$value) => {
          popup_link = $$value;
          $$settled = false;
        }
      },
      {}
    )}`;
  } while (!$$settled);
  return $$rendered;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(App, "App").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
