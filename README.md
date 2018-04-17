# Nordic Thingy:52 Node-red library

This library is using [Nordic-Thingy52-Nodejs](https://github.com/NordicPlayground/Nordic-Thingy52-Nodejs) and [Noble-device](https://github.com/noble/noble-device) BLE abstract to collect data from Thingy device.

Visualize on : https://iot.research.hamk.fi/visu/d/-BPJu9mik/thingy?from=1523898194792&to=1523908994792&orgId=2&refresh=5s

## Prerequisites
1. Add the latest version of Node.js to package manager (must be at least version 7.x): `curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -` or `https://nodejs.org/en/download/` 
2. Install dependencies: `sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev git nodejs`. (For Ubuntu/Debian/Raspbian usage)
3. Read more installation for Windows on [noble](https://github.com/noble/noble)

## Installation
1. Clone the repository: git clone https://github.com/hamk-automation/node-red-thingy.git
2. `cd ./node-red-thingy`.
3. Install noble-device: `npm install noble-device --unsafe-perm`
4. `npm link`
4. Pause current node-red: `node-red-stop`.
5. Go to node-red root directory `cd ~/.node-red` or `cd C:\Users\my_name\.node_red`: `npm link node-red-thingy`
6. Run: `sudo node-red-start` or `sudo node-red`. (Give node-red root permission)

