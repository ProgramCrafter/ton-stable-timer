import { 
    Cell,
    Slice, 
    Address, 
    Builder, 
    beginCell, 
    ComputeError, 
    TupleItem, 
    TupleReader, 
    Dictionary, 
    contractAddress, 
    ContractProvider, 
    Sender, 
    Contract, 
    ContractABI, 
    TupleBuilder,
    DictionaryValue
} from 'ton-core';

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    let sc_0 = slice;
    let _code = sc_0.loadRef();
    let _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function loadTupleStateInit(source: TupleReader) {
    let _code = source.readCell();
    let _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

function storeTupleStateInit(source: StateInit) {
    let builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounced: boolean;
    sender: Address;
    value: bigint;
    raw: Cell;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounced);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw);
    };
}

export function loadContext(slice: Slice) {
    let sc_0 = slice;
    let _bounced = sc_0.loadBit();
    let _sender = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _raw = sc_0.loadRef();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function loadTupleContext(source: TupleReader) {
    let _bounced = source.readBoolean();
    let _sender = source.readAddress();
    let _value = source.readBigNumber();
    let _raw = source.readCell();
    return { $$type: 'Context' as const, bounced: _bounced, sender: _sender, value: _value, raw: _raw };
}

function storeTupleContext(source: Context) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounced);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw);
    return builder.build();
}

function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    bounce: boolean;
    to: Address;
    value: bigint;
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeBit(src.bounce);
        b_0.storeAddress(src.to);
        b_0.storeInt(src.value, 257);
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
    };
}

export function loadSendParameters(slice: Slice) {
    let sc_0 = slice;
    let _bounce = sc_0.loadBit();
    let _to = sc_0.loadAddress();
    let _value = sc_0.loadIntBig(257);
    let _mode = sc_0.loadIntBig(257);
    let _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    let _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function loadTupleSendParameters(source: TupleReader) {
    let _bounce = source.readBoolean();
    let _to = source.readAddress();
    let _value = source.readBigNumber();
    let _mode = source.readBigNumber();
    let _body = source.readCellOpt();
    let _code = source.readCellOpt();
    let _data = source.readCellOpt();
    return { $$type: 'SendParameters' as const, bounce: _bounce, to: _to, value: _value, mode: _mode, body: _body, code: _code, data: _data };
}

function storeTupleSendParameters(source: SendParameters) {
    let builder = new TupleBuilder();
    builder.writeBoolean(source.bounce);
    builder.writeAddress(source.to);
    builder.writeNumber(source.value);
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function loadTupleDeploy(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

function storeTupleDeploy(source: Deploy) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    let _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function loadTupleDeployOk(source: TupleReader) {
    let _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

function storeTupleDeployOk(source: DeployOk) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type Bell = {
    $$type: 'Bell';
    timestamp: bigint;
    msg: Cell;
}

export function storeBell(src: Bell) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(src.timestamp, 32);
        b_0.storeRef(src.msg);
    };
}

export function loadBell(slice: Slice) {
    let sc_0 = slice;
    let _timestamp = sc_0.loadUintBig(32);
    let _msg = sc_0.loadRef();
    return { $$type: 'Bell' as const, timestamp: _timestamp, msg: _msg };
}

function loadTupleBell(source: TupleReader) {
    let _timestamp = source.readBigNumber();
    let _msg = source.readCell();
    return { $$type: 'Bell' as const, timestamp: _timestamp, msg: _msg };
}

function storeTupleBell(source: Bell) {
    let builder = new TupleBuilder();
    builder.writeNumber(source.timestamp);
    builder.writeCell(source.msg);
    return builder.build();
}

function dictValueParserBell(): DictionaryValue<Bell> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeBell(src)).endCell());
        },
        parse: (src) => {
            return loadBell(src.loadRef().beginParse());
        }
    }
}

export type ScheduleRequest = {
    $$type: 'ScheduleRequest';
    request: Bell;
}

export function storeScheduleRequest(src: ScheduleRequest) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeUint(3445486643, 32);
        b_0.store(storeBell(src.request));
    };
}

export function loadScheduleRequest(slice: Slice) {
    let sc_0 = slice;
    if (sc_0.loadUint(32) !== 3445486643) { throw Error('Invalid prefix'); }
    let _request = loadBell(sc_0);
    return { $$type: 'ScheduleRequest' as const, request: _request };
}

function loadTupleScheduleRequest(source: TupleReader) {
    const _request = loadTupleBell(source.readTuple());
    return { $$type: 'ScheduleRequest' as const, request: _request };
}

function storeTupleScheduleRequest(source: ScheduleRequest) {
    let builder = new TupleBuilder();
    builder.writeTuple(storeTupleBell(source.request));
    return builder.build();
}

function dictValueParserScheduleRequest(): DictionaryValue<ScheduleRequest> {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(beginCell().store(storeScheduleRequest(src)).endCell());
        },
        parse: (src) => {
            return loadScheduleRequest(src.loadRef().beginParse());
        }
    }
}

 type Timer_init_args = {
    $$type: 'Timer_init_args';
    owner: Address;
    init_bell: Bell;
}

function initTimer_init_args(src: Timer_init_args) {
    return (builder: Builder) => {
        let b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.store(storeBell(src.init_bell));
    };
}

async function Timer_init(owner: Address, init_bell: Bell) {
    const __code = Cell.fromBase64('te6ccgECFgEABG4AART/APSkE/S88sgLAQIBYgIDAXLQAdDTAwFxsMABkX+RcOIB+kABINdJgQELuvLgiCDXCwoggwm6AYEE/7qx8uCIVFBTA28E+GEC+GIEAgEgCQoDzu1E0NQB+GPSAAGOKfpAASDXSYEBC7ry4Igg1wsKIIMJugGBBP+6sfLgiAHTH9Mf9ARVMGwUjqr6QAEg10mBAQu68uCIINcLCiCDCboBgQT/urHy4IgB0x/UWRAjA9FY2zziVRPbPDARBQYC2u2i7ftwIddJwh+VMCDXCx/eApJbf+AhghDNXfQzuo4WMdMfAYIQzV30M7ry4IHTH9RZbBJbf+AhghCUapi2uo6jMdMfAYIQlGqYtrry4IHTPwExyAGCEK/5D1dYyx/LP8nbPH/gAcAAkTDjDXAHCABoyPhDAcx/AcoAVTBQQyDXSYEBC7ry4Igg1wsKIIMJugGBBP+6sfLgiM8Wyx8Syx/0AMntVAEaf/hCcFgDgEIBbW3bPBQAVPkBgvBwYOF8hZiXaalKOxGtNyvaWLyyA0EbqjhLEsZVYukSq7qTf9sx4ALNv0onaiaGoA/DHpAADHFP0gAJBrpMCAhd15cEQQa4WFEEGE3QDAgn/dWPlwRADpj+mP+gIqmDYKR1V9IACQa6TAgIXdeXBEEGuFhRBBhN0AwIJ/3Vj5cEQA6Y/qLIgRgeisbZ5xbZ5BELAgEgDA0ACBAjXwMCASAODwLVuIbm8i7UTQ1AH4Y9IAAY4p+kABINdJgQELuvLgiCDXCwoggwm6AYEE/7qx8uCIAdMf0x/0BFUwbBSOqvpAASDXSYEBC7ry4Igg1wsKIIMJugGBBP+6sfLgiAHTH9RZECMD0VjbPOJVE9s8gREgLNtmi9qJoagD8MekAAMcU/SAAkGukwICF3XlwRBBrhYUQQYTdAMCCf91Y+XBEAOmP6Y/6AiqYNgpHVX0gAJBrpMCAhd15cEQQa4WFEEGE3QDAgn/dWPlwRADpj+osiBGB6KxtnnFtnkBEQAJW3ejBOC52Hq6WVz2PQnYc6yVCjbNBOE7rGpaVsj5ZkWnXlv74sRzBOBAq4A3AM7HKZywdVyOS2WHBOGy84zdGHN4T1ltQmJrcbvLAABhNfAwFUbVMigQEBJarfJfkAqx+gUGXIWQLLH8zJRUAgbpUwWfRaMJRBM/QV4ts8EwAQXwaCEAvrwgABco0IZ/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADIIQEeGjAHJ/yIsIzxbJFEMwbW3bPBQBwshxAcoBUAcBygBwAcoCUAUg10mBAQu68uCIINcLCiCDCboBgQT/urHy4IjPFlAD+gJwAcpoI26zJW6zsZczMwFwAcoA4w0hbrOcfwHKAAEgbvLQgAHMlTFwAcoA4skB+wAVAJh/AcoAyHABygBwAcoAJG6znX8BygAEIG7y0IBQBMyWNANwAcoA4iRus51/AcoABCBu8tCAUATMljQDcAHKAOJwAcoAAn8BygACyVjM');
    const __system = Cell.fromBase64('te6cckECGAEABHgAAQHAAQEFoItDAgEU/wD0pBP0vPLICwMCAWIOBAIBIAwFAgEgCAYC1biG5vIu1E0NQB+GPSAAGOKfpAASDXSYEBC7ry4Igg1wsKIIMJugGBBP+6sfLgiAHTH9Mf9ARVMGwUjqr6QAEg10mBAQu68uCIINcLCiCDCboBgQT/urHy4IgB0x/UWRAjA9FY2zziVRPbPIFAcAEF8GghAL68IAAgEgCgkAlbd6ME4LnYerpZXPY9CdhzrJUKNs0E4TusalpWyPlmRadeW/vixHME4ECrgDcAzscpnLB1XI5LZYcE4bLzjN0Yc3hPWW1CYmtxu8sALNtmi9qJoagD8MekAAMcU/SAAkGukwICF3XlwRBBrhYUQQYTdAMCCf91Y+XBEAOmP6Y/6AiqYNgpHVX0gAJBrpMCAhd15cEQQa4WFEEGE3QDAgn/dWPlwRADpj+osiBGB6KxtnnFtnkBQLAAYTXwMCzb9KJ2omhqAPwx6QAAxxT9IACQa6TAgIXdeXBEEGuFhRBBhN0AwIJ/3Vj5cEQA6Y/pj/oCKpg2CkdVfSAAkGukwICF3XlwRBBrhYUQQYTdAMCCf91Y+XBEAOmP6iyIEYHorG2ecW2eQUDQAIECNfAwFy0AHQ0wMBcbDAAZF/kXDiAfpAASDXSYEBC7ry4Igg1wsKIIMJugGBBP+6sfLgiFRQUwNvBPhhAvhiDwPO7UTQ1AH4Y9IAAY4p+kABINdJgQELuvLgiCDXCwoggwm6AYEE/7qx8uCIAdMf0x/0BFUwbBSOqvpAASDXSYEBC7ry4Igg1wsKIIMJugGBBP+6sfLgiAHTH9RZECMD0VjbPOJVE9s8MBQREABoyPhDAcx/AcoAVTBQQyDXSYEBC7ry4Igg1wsKIIMJugGBBP+6sfLgiM8Wyx8Syx/0AMntVALa7aLt+3Ah10nCH5UwINcLH94Cklt/4CGCEM1d9DO6jhYx0x8BghDNXfQzuvLggdMf1FlsElt/4CGCEJRqmLa6jqMx0x8BghCUapi2uvLggdM/ATHIAYIQr/kPV1jLH8s/yds8f+ABwACRMOMNcBMSAFT5AYLwcGDhfIWYl2mpSjsRrTcr2li8sgNBG6o4SxLGVWLpEqu6k3/bMeABGn/4QnBYA4BCAW1t2zwWAVRtUyKBAQElqt8l+QCrH6BQZchZAssfzMlFQCBulTBZ9FowlEEz9BXi2zwVAXKNCGf4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAyCEBHhowByf8iLCM8WyRRDMG1t2zwWAcLIcQHKAVAHAcoAcAHKAlAFINdJgQELuvLgiCDXCwoggwm6AYEE/7qx8uCIzxZQA/oCcAHKaCNusyVus7GXMzMBcAHKAOMNIW6znH8BygABIG7y0IABzJUxcAHKAOLJAfsAFwCYfwHKAMhwAcoAcAHKACRus51/AcoABCBu8tCAUATMljQDcAHKAOIkbrOdfwHKAAQgbvLQgFAEzJY0A3ABygDicAHKAAJ/AcoAAslYzGBQLUM=');
    let builder = beginCell();
    builder.storeRef(__system);
    builder.storeUint(0, 1);
    initTimer_init_args({ $$type: 'Timer_init_args', owner, init_bell })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

const Timer_errors: { [key: number]: { message: string } } = {
    2: { message: `Stack undeflow` },
    3: { message: `Stack overflow` },
    4: { message: `Integer overflow` },
    5: { message: `Integer out of expected range` },
    6: { message: `Invalid opcode` },
    7: { message: `Type check error` },
    8: { message: `Cell overflow` },
    9: { message: `Cell underflow` },
    10: { message: `Dictionary error` },
    13: { message: `Out of gas error` },
    32: { message: `Method ID not found` },
    34: { message: `Action is invalid or not supported` },
    37: { message: `Not enough TON` },
    38: { message: `Not enough extra-currencies` },
    128: { message: `Null reference exception` },
    129: { message: `Invalid serialization prefix` },
    130: { message: `Invalid incoming message` },
    131: { message: `Constraints error` },
    132: { message: `Access denied` },
    133: { message: `Contract stopped` },
    134: { message: `Invalid argument` },
    135: { message: `Code of a contract was not found` },
    136: { message: `Invalid address` },
    137: { message: `Masterchain support is not enabled for this contract` },
}

export class Timer implements Contract {
    
    static async init(owner: Address, init_bell: Bell) {
        return await Timer_init(owner, init_bell);
    }
    
    static async fromInit(owner: Address, init_bell: Bell) {
        const init = await Timer_init(owner, init_bell);
        const address = contractAddress(0, init);
        return new Timer(address, init);
    }
    
    static fromAddress(address: Address) {
        return new Timer(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        errors: Timer_errors
    };
    
    private constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: ScheduleRequest | 'Tick' | Deploy) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ScheduleRequest') {
            body = beginCell().store(storeScheduleRequest(message)).endCell();
        }
        if (message === 'Tick') {
            body = beginCell().storeUint(0, 32).storeStringTail(message).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getEarliestSchedule(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('earliest_schedule', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getFurthestSchedule(provider: ContractProvider) {
        let builder = new TupleBuilder();
        let source = (await provider.get('furthest_schedule', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
    async getScheduleFee(provider: ContractProvider, bell: Bell) {
        let builder = new TupleBuilder();
        builder.writeTuple(storeTupleBell(bell));
        let source = (await provider.get('schedule_fee', builder.build())).stack;
        let result = source.readBigNumber();
        return result;
    }
    
}