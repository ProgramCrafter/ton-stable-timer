# About
This is a timer on TON allowing users to schedule sending message to some time in the future.  
Built fully on TON, works without any external messaging, so it can be considered reliable.

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
