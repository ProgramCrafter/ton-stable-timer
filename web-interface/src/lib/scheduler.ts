import TonWeb from "tonweb";
import { timer_code } from "./consts";


type SendParamsRelaxed = {destination: string, time: string, value_ton: string, message: string};
type DeployParamsRelaxed = {bounty_address: string};
type AmountCalc = {base_amount: bigint, add_per_second: bigint, time_limit: Date};
export type MessageParamsCalc = {amount: AmountCalc, payload: string};
export type MessageParams = {address: string, amount: string, stateInit?: string, payload: string};
export type ExistingTimer = {address: string, time_limit: Date};

export function substitute_values(base: MessageParamsCalc, contract: ExistingTimer) : MessageParams {
    let dt = BigInt(Math.ceil(Math.max(0, +base.amount.time_limit - +contract.time_limit) / 1000));
    return {
        address: contract.address,
        stateInit: undefined,
        payload: base.payload,
        amount: '' + (base.amount.base_amount + base.amount.add_per_second * dt)
    }
}

export async function make_join_message(send_parameters : SendParamsRelaxed) : Promise<MessageParamsCalc> {
    if (+send_parameters.value_ton < 0.1) {
        throw new Error("send requires >= 0.1 TON")
    }

    let schedule_message = new TonWeb.boc.Cell();
    schedule_message.bits.writeUint(0x10, 6);
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
    main_message.bits.writeUint(0x24E5F1CA, 32);
    main_message.bits.writeUint(Math.ceil(+new Date(send_parameters.time) / 1000), 32);
    main_message.refs.push(schedule_message);
    main_message.print();

    let main_message_boc = await main_message.toBoc(false);
    return {
        amount: {
            base_amount: 600n * 1000000n + BigInt(+send_parameters.value_ton * 1e9),
            add_per_second: 3000000n,   // 3 milliTON/s
            time_limit: new Date(send_parameters.time)
        },
        payload: TonWeb.utils.bytesToBase64(main_message_boc)
    };
}

export async function make_deploy_message(send_parameters : SendParamsRelaxed,
        deploy_parameters: DeployParamsRelaxed) : Promise<MessageParams> {
    let join_message = await make_join_message(send_parameters);
    
    let data_cell = new TonWeb.boc.Cell();
    data_cell.bits.writeUint(0, 1);
    data_cell.bits.writeUint(Math.ceil(+new Date() / 1000), 64);
    data_cell.bits.writeAddress(new TonWeb.Address(deploy_parameters.bounty_address));

    let code_cell = TonWeb.boc.Cell.oneFromBoc(TonWeb.utils.base64ToBytes(timer_code));

    let init_cell = new TonWeb.boc.Cell();
    init_cell.bits.writeUint(6, 5);
    init_cell.refs.push(code_cell);
    init_cell.refs.push(data_cell);

    let hex_addr = '0:' + TonWeb.utils.bytesToHex(await init_cell.hash());
    let new_timer_address = (new TonWeb.Address(hex_addr)).toString(true, true, true);

    let deploy_message = substitute_values(
        join_message,
        {address: new_timer_address, time_limit: new Date()}
    );
    deploy_message.stateInit = TonWeb.utils.bytesToBase64(await init_cell.toBoc(false));
    return deploy_message;
}
