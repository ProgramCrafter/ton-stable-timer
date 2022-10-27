# About
This is a timer on TON allowing users to schedule sending message to some time in the future.  
Built fully on TON, works without any external messaging, so it can be considered reliable.

It's different of https://github.com/EmelyanenkoK/ton_scheduler as the previous solution stores all schedules in one contract thus doesn't support sharding, and this solution keeps scheduled messages in separate contracts (bells) acting like ![soul-bound tokens (TEP 0085)](https://github.com/ton-blockchain/TEPs/blob/master/text/0085-sbt-standard.md).

Precision of the timer is near 7 seconds.

The timer supports sending messages with arbitrary payload (stored in schedule request) and attached value.

# Usage
To schedule something, send a message with the structure below to timer smart-contract:
```
schedule#_ forward_nanotons:uint64 schedule_at:uint32 addr:^MsgAddressInt body:^Any = ScheduleRequest;
```

There are some special commands for me as the timer owner:
```
restart_scheduling_loop#_  opcode[=1]:uint64 = OwnerMessage;
pull_ton_from_timer#_      amount[>1]:uint64 = OwnerMessage;  (*)
```

# Internal messages between timer and bells
```
_ priority:uint64 time:uint32 value:uint64 destination:MsgAddressInt body:^Any = BellDescriptor;
_ bell_node_addr:MsgAddressInt bell_priority:uint64 bell_time:uint32 = BellInfo;
_ left:(Maybe BellInfo) right:(Maybe BellInfo) = BellInfoLR;

_ leftmost_schedule_time:uint32 root_bell:(Maybe BellInfo) bell:^Code = TimerContractData;
_ data:BellDescriptor core_addr:MsgAddressInt children:^BellInfoLR init_children:^BellInfoLR = BellContractData;

proof_core$0 bell_code:^Code = IdentProof;
proof_bell$1 init:^BellContractData code:^Code = IdentProof;

direct_init#_ = BellInboundMsg;
retranslate_init#fbffab22 data:BellDescriptor proof:IdentProof = BellInboundMsg;
bell#733be087 proof:IdentProof [TODO/forwarder:MsgAddressInt] = BellInboundMsg;
hang_new_bell#96f5c875 proof:IdentProof right_node:(Maybe BellInfo) = BellInboundMsg;

update_next_wakeup#07ebc8c5 proof:IdentProof bell_time:uint32 bell_rtime:uint32 = TimerInboundMsg;
tick#_ = TimerInboundMsg;
pull_ton_out#_ (nanoton >= 1) nanoton:uint64 = TimerInboundMsg;
restart_loop#0000000000000001 = TimerInboundMsg;
schedule_msg#f5431aa5 time:uint32 value:uint64 destination:MsgAddressInt body:^Any =
  TimerInboundMsg;
```
| type                   | bits | refs |
| ====================== | ==== | ==== |
| BellDescriptor         | 427  | 1    |
| BellInfo               | 363  | 0    |
| BellInfoLR             | 728  | 0    |
| TimerContractData      | 299  | 0    |
| BellContractData       | 694  | 3    |
| IdentProof$..core      | 1    | 1    |
| IdentProof$..bell      | 1    | 2    |
| IdentProof             | 1    | 2    |
| BellInboundMsg         | 460  | 3    |
| TimerInboundMsg        | 65   | 2    |

| source     | destination   | purpose               | scheme                 |
| ===        | ===           | ===                   | ===                    |
| timer/bell | existing bell | initializing new bell | BellRetranslateInitMsg |
| timer/bell | new bell      | initializing new bell | BellInitMsg            |

# Pricing
The timer uses TON coins to keep working. So, scheduling messages has its price: 6.5 TON/h (more precisely, 1805556 nanoTON/s).

Price of scheduling message can be calculated as **0.4 TON** *(timer's profit)* + **6.5 TON/h \* \<scheduling time in hours>** *(cost of keeping timer awake)* + **\<requested value to forward>**.

As timer aims to provide service to a lot of people, there will be lots of overlapping messages, and this allows to make prices lower than self-hosted timer would cost.

# Errors
Messages with insufficient value will be rejected with exit code **101**; if requested forward TON amount is unreasonably small (less than 0.01 TON), scheduling will fail with exit code **100**.  
As well, the timer does not support scheduling multiple messages to the same moment. It adds random value between 0 and 16 (creating delay up to 15s) to avoid multiple schedules at round numbers of seconds. If the timer finds out that the time is already taken, there will be failure with exit code **102**.

# Special details
(\*)  
My ability to pull money from timer is limited: I can't take money unless remaining balance is enough for timer to work up to the end of the Unix epoch (2106 year).  
However, if there is too much money (more than 10M), I'll be able to extract excesses for other purposes.
