import { Address, beginCell, Cell, Contract, ContractProvider, contractAddress, Sender, toNano, Builder } from "ton-core";
import { Blockchain } from "@ton-community/sandbox";

class TimerUnit implements Contract {
  static readonly code = Cell.fromBase64('te6ccgECCAEAArcAART/APSkE/S88sgLAQPk0wHQ0wMBcbCPZiHHAJJfA49dAdMfAYIQJOXxyrqPTAH6QDAB0x/UMO1E0PQE0z8BIlFCQxRHZts8FL7y4IxujoSIcPsA3oIQF9eEAHCAEMjLBVADzxYB+gLLiotkJvdW50eYzxbJcPsA7VSSXwPi4uMNAgcDAfDtRCT4I6EBggGGoPlBMFiAEvgz+Cj6RDABgCD0DG+hMIAo1yHTPwOoAtM/MFADqKABqKsPcFM1vI4SMDWCCC3GwFFCoRSoIRA1UEQDkTTiAqof+CWCEDuAAAGpCLFUQReAQPQXVBBDAsj0ABLLPwHPFskC+COhUiAEAexfA/gA7UTQ9ATTPwEC+CMhgED0h2+lnFMTArOSW3CTqx++4o4TAXD7AFiAQPRbMCCAQPSHb6UQNOhfAyBujiIwMXBwgBDIywVQA88WAfoCy4qLZCb3VudHmM8WyYEAoPsAjpICAsj0ABLLPwHPFsntVIhw+wDiBwGKAYIBhqD5QTBYgBL4M/go+kQwAYAg9AxvoTCAKNch0z8DqALTPzBQA6igAairD1ADoYIQBfXhAAGCEBfXhACgUAOgWKACBQHccAHQ0wABntMAAcAB8uBk+kAx+kAxjkcx0wIBc7Dy0G76QI0IZ/kBGCgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADDL6QFnHBfLQb/oA9AQBbvLgcPoAMfoAMeKAYNch0wAB4wDTADAwEqAGAJzTAAGOJdQB0NMAAZN11yHe0wABk3LXId7TAAGS1DHe0wABktQx3vQEMTCOIdMAAZN11yHe0wABk3LXId7TAAGS1DHe0wABktQx3vQEMeIAaGJ/kBGCgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgJiWgAAAAAAAAAAAAAAAAAAA=')
  
  constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}
  
  static createFromInitOwner(owner: Address, workchain = 0) {
    const data = beginCell()
      .storeBit(false)
      .storeUint(0, 64)
      .storeAddress(owner)
      .endCell();
    const init = {code: TimerUnit.code, data};
    return new TimerUnit(contractAddress(workchain, init), init);
  }
  
  async sendScheduleMessage(provider: ContractProvider, via: Sender, params: {
    to: Address,
    value: bigint,
    body: Cell,
    timestamp: number
  }) {
    const offset = params.timestamp - Math.floor(+new Date() / 1000);
    const msg = beginCell()
      .storeUint(0x10, 6)
      .storeAddress(params.to)
      .storeCoins(params.value)
      .storeUint(1, 107)
      .storeRef(params.body);
    
    await provider.internal(via, {
      value: params.value + toNano('' + 0.003 * offset) + toNano('0.6'),
      body: beginCell()
           .storeUint(0x24E5F1CA, 32)
           .storeUint(params.timestamp, 32)
           .storeRef(msg)
           .endCell()
    });
  }
}

(async () => {
    const blockchain = await Blockchain.create();
    const deployer = await blockchain.treasury('deployer')
    const timer = blockchain.openContract(TimerUnit.createFromInitOwner(deployer.address))
    const msg_body = beginCell().storeUint(0, 32).storeStringTail("Timer works").endCell()
    const timestamp = Math.floor(+new Date() / 1000) + 0
    const schedule_result = await timer.sendScheduleMessage(deployer.getSender(), {
        to: deployer.address,
        value: toNano('0.25'),
        body: msg_body,
        timestamp
    })
    console.log(schedule_result)
})();