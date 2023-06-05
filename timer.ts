import { Address, beginCell, Cell, Contract, ContractProvider, contractAddress, Sender, toNano, Builder } from "ton-core";
import { Blockchain } from "@ton-community/sandbox";

class TimerUnit implements Contract {
  static readonly code = Cell.fromBase64('te6ccgECCAEAAs8AART/APSkE/S88sgLAQPk0wHQ0wMBcbCPZiHHAJJfA49dAdMfAYIQJOXxyrqPTAH6QDAB0z/UMO1E0PQE0z8BIlFCQxRHZts8FL7y4IxujoSIcPsA3oIQF9eEAHCAEMjLBVADzxYB+gLLiotkJvdW50eYzxbJcPsA7VSSXwPi4uMNAgcDAeLtRCT4I6EBggGGoPlBMFiAEvgz+Cj6RDABgCD0DG+hMIAo1yHTPwOoAtM/MFADqKABqKsPcCduk/gjNt5TNbyOEjA1IYIILcbABaEUqCEQNVBEA5E04gKqH/glghA7gAABqQixVEEXgGD0N/LgqlQQQwQB7F8D+ADtRND0BNM/AQL4IyGAYPSHb6WcUxMCs5JbcJOrH77ijhMBcPsAWIBg9FswIIBg9IdvpRA06F8DIG6OIjAxcHCAEMjLBVADzxYB+gLLiotkJvdW50eYzxbJgQCg+wCOkgICyPQAEss/Ac8Wye1UiHD7AOIHAawCyPQAEss/Ac8WyQL4I6FSIAGCAYag+UEwWIAS+DP4KPpEMAGAIPQMb6EwgCjXIdM/A6gC0z8wUAOooAGoqw9QA6GCEAX14QABghAX14QAoFADoFigAgUB+HAB0NMAAZ7TAAHAAfLgZPpAMfpAMY5RMdMCAXOw8tBu+kCNCGf5ARgoEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwy+kBZxwXy0G/6ACGCCJiWgL7y4HH0BAFu8uBw+gAx+gAx4oBg1yHTAAHjANMAAZLUMd4wEqAGAJzTAAGOJdQB0NMAAZN11yHe0wABk3LXId7TAAGS1DHe0wABktQx3vQEMTCOIdMAAZN11yHe0wABk3LXId7TAAGS1DHe0wABktQx3vQEMeIAaGJ/kBGCgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgJiWgAAAAAAAAAAAAAAAAAAA=')
  
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
      value: params.value + toNano('' + 0.003 * offset) + toNano('0.8'),
      body: beginCell()
           .storeUint(0x24E5F1CA, 32)
           .storeUint(params.timestamp, 64)
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
    const timestamp = Math.floor(+new Date() / 1000) + 10
    const schedule_result = await timer.sendScheduleMessage(deployer.getSender(), {
        to: deployer.address,
        value: toNano('0.25'),
        body: msg_body,
        timestamp
    })
    console.log(schedule_result)
})();