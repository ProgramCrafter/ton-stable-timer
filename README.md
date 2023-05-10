# Build (Linux)

1. `npx func-js func/*.fc --boc build/timer.boc`
2. `base64 -w 0 build/timer.boc >build/timer.boc.b64`

# Test

1. `npx ts-node timer.js`
