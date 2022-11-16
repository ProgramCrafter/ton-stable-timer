import functools
import traceback
import asyncio
import time
import os

def logged(fn):
  @functools.wraps(fn)
  def wrapper(*a, **k):
    print(f'\x1b[34m[{fn.__qualname__}]\x1b[30m', *a, sep='    \t')
    return fn(*a, **k)
  return wrapper

contracts = {}
messages = []

SPACES = ' ' * 80

@logged
def start(msg):
  messages[-1].append(msg)

@logged
async def invoke(addr, msg):
  assert addr in contracts
  assert addr == msg['dst']
  assert msg['value'] > 1
  msg['value'] -= 1
  
  # print(f'  \x1b[35m{msg["src"]} sent message {msg}\x1b[30m')
  
  messages.append([])
  
  await contracts[addr][0](msg)
  
  for out_msg in messages.pop():
    # print(f'  \x1b[35m{addr} sent message {out_msg} without waiting\x1b[30m')
    await invoke(out_msg['dst'], out_msg)

@logged
async def deploy(addr, code, data):
  if addr in contracts:
    raise Exception('Already deployed')
  contracts[addr] = [code, data]

@logged
def get_data(addr):
  return contracts[addr][1]

@logged
def set_data(addr, data):
  contracts[addr][1] = data

################################################################################

@logged
async def timer_main(msg):
  if msg['src'] == '[owner]':
    if msg['body'] == 'pull_ton_out':
      print('  \x1b[31mtimer: pulling TON out\x1b[30m')
      start({'src': '[timer]', 'dst': '[owner]', 'value': 100, 'body': ''})
    elif msg['body'] == 'restart_loop':
      print('  \x1b[31mtimer: restarting timer loop\x1b[30m')
      start({'src': '[timer]', 'dst': '[mc]', 'value': 50, 'body': ''})
    else:
      print('  \x1b[31mtimer: unknown owner message\x1b[30m')
      raise NotImplementedError()
  elif msg['src'] == '[mc]':
    print('  \x1b[31mtimer: processing schedule\x1b[30m')
    d = get_data(msg['dst'])
    if d['next_wakeup'] < time.time():
      start({'src': '[timer]', 'dst': d['next_wakeup']['addr'], 'value': 10, 'body': 'bell'})
    elif d['next_wakeup'] < 0xFFFFFFFF:
      start({'src': '[timer]', 'dst': '[mc]', 'value': 50, 'body': ''})
  elif msg['body'] == 'schedule_msg':
    print('  \x1b[31mtimer: creating schedule\x1b[30m')
    assert msg['value'] >= 100
    raise NotImplementedError()
  else:
    print('  \x1b[31mtimer: unknown message\x1b[30m')
    raise NotImplementedError()

@logged
async def owner_main(msg):
  pass

@logged
async def masterchain_bouncer(msg):
  start({'src': msg['dst'], 'dst': msg['src'], 'value': msg['value'], 'body': ''})

async def main():
  timer_data = {
    'next_wakeup': 0xFFFFFFFF,
    'root_bell':   None,
    'bell_code':   None
  }
  await deploy('[owner]', owner_main, None)
  await deploy('[mc]', masterchain_bouncer, None)
  await deploy('[timer]', timer_main, timer_data)
  
  print()
  await invoke('[timer]', {
    'src': '[owner]', 'dst': '[timer]', 'value': 2,
    'body': 'pull_ton_out'
  })
  
  print()
  await invoke('[timer]', {
    'src': '[owner]', 'dst': '[timer]', 'value': 2,
    'body': 'restart_loop'
  })
  
  print()
  await invoke('[timer]', {
    'src': '[user1]', 'dst': '[timer]', 'value': 101,
    'body': 'schedule_msg'
  })

################################################################################

try:
  os.system('')
  print('\x1b[47m', end='', flush=True)
  print('\x1b[2J')
  asyncio.run(main())
except:
  print('\x1b[35m')
  traceback.print_exc()
  print('\x1b[30m')
finally:
  input('...')
