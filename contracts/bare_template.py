from zlib import crc32
from rift import *



class Bell(Model):
    'Bell representation'
    scheduled_at:  uint32
    scheduled_msg: Ref[Cell]

class Data(Model):
    'Contract data'
    earliest:  uint32
    schedules: Dict  # Dict[uint256, Bell]

class ScheduleRequest(Payload):
    'Request to schedule a message'
    new_bell: Bell
    _wanted_opcode = crc32(b'timer::rift::ScheduleRequest')

class BounceMsg(Payload):
    'Message sent by timer and bounced back'
    _wanted_opcode = 0xFFFFFFFF



class TimerContract(Contract):
    data: Data
    
    @impure
    def process_schedules(self) -> None:
        if self.data.earliest_schedule > std.now():
            self.send_bounce()
            return
        
        schedules = self.data.schedules
        while True:
            schedules, key, bell, ok = std.udict_delete_get_min(schedules, 256)
            if not ok:
                break
            bell = bell % Bell
            if bell.scheduled_at > std.now():
                schedules = std.udict_set(schedules, 256, key, bell)
                self.send_bounce()
                break
            std.send_raw_message(bell.scheduled_msg, 0)
        self.data.schedules = schedules
    
    def internal_receive(self) -> None:
        msg = self.message
        opcode = msg >> uint32

        if opcode == BounceMsg._wanted_opcode:
            self.process_schedules()
            return
        
        assert opcode == ScheduleRequest._wanted_opcode, 101
        if std.dict_empty_check(self.data.schedules):
            self.send_bounce()
        msg = msg % ScheduleRequest
        
    
    # def external_receive(self) -> None:
    #     TODO: make external messages wake timer up
