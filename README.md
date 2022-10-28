# About
This is a timer on TON allowing users to schedule sending message to some time in the future.  
Built fully on TON, works without any external messaging, so it can be considered reliable.

It's different of https://github.com/EmelyanenkoK/ton_scheduler as the previous solution stores all schedules in one contract thus doesn't support sharding, and this solution keeps scheduled messages in separate contracts (bells) acting like ![soul-bound tokens (TEP 0085)](https://github.com/ton-blockchain/TEPs/blob/master/text/0085-sbt-standard.md).

Precision of the timer is near 7 seconds.

The timer supports sending messages with arbitrary payload (stored in schedule request) and attached value.

# [TL;DR] Usage
To schedule something, send a message with the structure below to timer smart-contract:
```
schedule_msg#f5431aa5 time:uint32 value:uint64 destination:MsgAddressInt body:^Any =
  TimerInboundMsg;
```
You'll receive your message (with body taken from reference) not earlier than at specified time.

# Internal details: TL-B schemes

## Common types
```
_ priority:uint64 time:uint32 value:uint64 destination:MsgAddressInt body:^Any = BellDescriptor;
_ bell_node_addr:MsgAddressInt bell_priority:uint64 bell_time:uint32 = BellInfo;
_ left:(Maybe BellInfo) right:(Maybe BellInfo) = BellInfoLR;

_ leftmost_schedule_time:uint32 root_bell:(Maybe BellInfo) bell:^Code = TimerContractData;
_ data:BellDescriptor core_addr:MsgAddressInt children:^BellInfoLR init_children:^BellInfoLR = BellContractData;

proof_core$0 bell_code:^Code = IdentProof;
proof_bell$1 init:^BellContractData code:^Code = IdentProof;
```

## Internal messages
```
direct_init#_ = BellInboundMsg;
retranslate_init#fbffab22 data:BellDescriptor proof:IdentProof = BellInboundMsg;
bell#733be087 proof:IdentProof [TODO/forwarder:MsgAddressInt] = BellInboundMsg;
hang_new_bell#96f5c875 proof:IdentProof right_node:(Maybe BellInfo) = BellInboundMsg;

root_update_next_wakeup#d416dc0f proof:IdentProof right_child:(Maybe BellInfo) = TimerInboundMsg;
update_next_wakeup#07ebc8c5 proof:IdentProof bell_time:uint32 bell_rtime:uint32 = TimerInboundMsg;
tick#_ = TimerInboundMsg;
pull_ton_out#_ (nanoton >= 1) nanoton:uint64 = TimerInboundMsg;
restart_loop#0000000000000001 = TimerInboundMsg;
schedule_msg#f5431aa5 time:uint32 value:uint64 destination:MsgAddressInt body:^Any =
  TimerInboundMsg;
```

## Used bits and refs in each type

| type                   | bits | refs |
| ---------------------- | ---- | ---- |
| BellDescriptor         | 427  | 1    |
| BellInfo               | 363  | 0    |
| BellInfoLR             | 728  | 0    |
| TimerContractData      | 396  | 1    |
| BellContractData       | 694  | 3    |
| IdentProof$..core      | 1    | 1    |
| IdentProof$..bell      | 1    | 2    |
| [IdentProof]           | 1    | 2    |
| BellIn$direct_init     | 0    | 0    |
| BellIn$retrans_init    | 460  | 3    |
| BellIn$bell            | 33   | 2    |
| BellIn$hang_new_bell   | 397  | 2    |
| [BellInboundMsg]       | 460  | 3    |
| TimerIn$root_upd_wake  | 397  | 2    |
| TimerIn$upd_wake       | 97   | 2    |
| TimerIn$tick           | 0    | 0    |
| TimerIn$restart_loop   | 64   | 0    |
| TimerIn$pull_ton_out   | 64   | 0    |
| TimerIn$schedule_msg   | 395  | 1    |
| [TimerInboundMsg]      | 397  | 2    |

## Decriptions of message types

| source     | destination   | purpose               | scheme                  |
| ----       | ----          | ----                  | ----                    |
| user       | timer         | scheduling message    | schedule_msg            |
| timer/bell | existing bell | initializing new bell | retranslate_init        |
| timer/bell | new bell      | initializing new bell | direct_init             |
| timer/bell | existing bell | sending message       | bell                    |
| leaf bell  | parent bell   | changing child node   | hang_new_bell           |
| root bell  | timer         | changing child node   | root_update_next_wakeup |
| lower bell | timer         | changing next wakeup  | update_next_wakeup      |
| timer      | bounce->timer | ticking               | tick                    |
| owner (me) | timer         | restarting loop       | restart_loop            |
| owner (me) | timer         | withdrawing coins     | pull_ton_out            |

# Pricing
The timer uses TON coins to keep working. So, scheduling messages has its price: 6.5 TON/h (more precisely, 1805556 nanoTON/s).

Price of scheduling message can be calculated as **0.4 TON** *(timer's profit)* + **6.5 TON/h \* \<scheduling time in hours>** *(cost of keeping timer awake)* + **\<requested value to forward>**.

As timer aims to provide service to a lot of people, there will be lots of overlapping messages, and this allows to make prices lower than self-hosted timer would cost.

# Errors
Messages with insufficient value will be rejected with exit code **101**; if requested forward TON amount is unreasonably small (less than 0.01 TON), scheduling will fail with exit code **100**.

# Special details
`(*)` My ability to pull money from timer is limited: I can't take money unless remaining balance is enough for timer to work up to the end of the Unix epoch (2106 year).  
So, only and if only there is too much money (more than 10M), I'll be able to extract excesses for other purposes.

# TODO
[ ]. Create forwarder contract that will not be trusted by timer-bells structure (so user-provided messages could not break its invariants) and will be trusted by users instead of bells with address unknown till schedule is done.
[ ]. Add opcodes to owner operations.
[ ]. Make forwarder and timer address config parameters.
[ ]. Make price configurable by TON validators.
