import { getHttpEndpoint } from "@orbs-network/ton-access";
import TonWeb from "tonweb";
import { timers_gql_request, timer_code } from "./consts.js";
import type { ExistingTimer } from "./scheduler";

type AddressInformation = {
    state: 'uninitialized' | 'active' | 'frozen' | string,
    data: string,
    code: string
};


export async function load_timers(is_testnet=false) : Promise<ExistingTimer[]> {
    if (is_testnet) {
        throw new Error("testnet not implemented");
    }

    const endpoint = await getHttpEndpoint();
    const provider = new TonWeb.HttpProvider(endpoint);
  
    const tx_list_response = await fetch('https://dton.io/graphql/', {
      method: 'POST',
      body: JSON.stringify({query: timers_gql_request}),
      headers: {'Content-Type': 'application/json'}
    });
    const tx_list = (await tx_list_response.json()).data.transactions;

    const wanted_code_cell = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(timer_code));
    const wanted_code_hash = TonWeb.utils.bytesToHex(await wanted_code_cell.hash());

    let timers_list : ExistingTimer[] = [];
    let seen_timers : Map<string /* timer hex address */, boolean> = new Map();
    for (let tx of tx_list) {
        const src_addr_hex = tx.in_msg_src_addr_workchain_id + ':' + tx.in_msg_src_addr_address_hex;
        const src_addr = (new TonWeb.Address(src_addr_hex)).toString(true, true, true);
            
        if (seen_timers.has(src_addr_hex)) continue;
        seen_timers.set(src_addr_hex, true);
    
        const timer_state = await provider.getAddressInfo(src_addr) as AddressInformation;
        
        if (timer_state.state == 'uninitialized') {
            console.log('Found deactivated timer', src_addr);
            continue;
        } else {
            if (timer_state.code != timer_code) {
                const code_cell = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(timer_state.code));
                const code_hash = TonWeb.utils.bytesToHex(await code_cell.hash());

                if (code_hash != wanted_code_hash) {
                    console.warn('Possible fraud attempt: contract with code != timer', src_addr);
                    continue;
                }
            }

            // parsing contract data
            let timer_data = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(timer_state.data));
            
            // we don't have Slice in current version of TonWeb
            // let ds = timer_data.beginParse();
            let timer_data_shifted = new TonWeb.boc.Cell();
            timer_data_shifted.bits.writeUint(0, 7);
            timer_data_shifted.writeCell(timer_data);
            let end_timestamp = TonWeb.utils.readNBytesUIntFromArray(
                8, timer_data_shifted.bits.array.slice(1)
            );

            timers_list.push({
                address: src_addr,
                time_limit: new Date(end_timestamp * 1000)
            });
        }
    }

    return timers_list;
}

