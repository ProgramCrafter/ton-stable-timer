import "@stdlib/deploy";
 
struct Bell {
    timestamp: Int as uint32;
    msg:       Cell;
}
message ScheduleRequest {
    request:   Bell;
}
message(0xFFFFFFFF) Tick {
    amount: Int as uint32;
}
struct StoragePrices {
    tag:              Int as uint8;
    utime_since:      Int as uint32;
    bit_price_ps:     Int as uint64;
    cell_price_ps:    Int as uint64;
    mc_bit_price_ps:  Int as uint64;
    mc_cell_price_ps: Int as uint64;
}


const empty_cell:  Cell    = cell("te6ccsEBAQEAAgAAAAC1U5ck");
const bounce_addr: Address = address("-1:0000000000000000000000000000000000000000000000000000000000000001");

contract Timer with Deployable {
    deployer:  Address;
    earliest:  Int as uint32;
    furthest:  Int as uint32;
    schedules: map<Int, Bell>;
    
    init(owner: Address, init_bell: Bell) {
        self.deployer = owner;
        self.earliest = init_bell.timestamp;
        self.furthest = init_bell.timestamp;
        self.schedules.set((init_bell.timestamp << (256 - 32)) + (init_bell.msg.hash() >> 32), init_bell);
        self.send_tick();
    }

    fun send_tick() {
        send(SendParameters{
            to:      bounce_addr,
            value:   ton("0.3"),
            mode:    2,
            bounce:  true,
            body:    empty_cell
        });
    }
    
    receive(msg: ScheduleRequest) {
        // as the contract is alive, it is still ticking
    }

    receive(_: Tick) {
        require(sender() == bounce_addr, "Invalid tick sender");
        // otherwise we could end up sending multiple messages to masterchain from a single block

        if (self.earliest <= now()) {
            while (true) {
                // FunC intrinsic required
            }
        }

        if (self.furthest > now()) {
            self.send_tick();
        } else {
            send(SendParameters{
                to:      self.deployer,
                value:   0,
                mode:    160,
                bounce:  false,
                body:    empty_cell
            });
        }
    }

    get fun earliest_schedule(): Int {
        return self.earliest;
    }

    get fun furthest_schedule(): Int {
        return self.furthest;
    }

    get fun schedule_fee(bell: Bell): Int {
        let fee: Int = ton("0.2");
        
        let storage_info: Cell = getConfigParam(18)!!;
        // let storage_cfg: map<Int, StoragePrices> = storage_info;
        
        return fee;
    }
}
