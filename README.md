# Nordic Thingy:52 Node-red library

This is library is using [Nordic-Thingy52-Nodejs](https://github.com/NordicPlayground/Nordic-Thingy52-Nodejs) to collect data from Thingy device.

## Prerequisites
1. Add the latest version of Node.js to package manager (must be at least version 7.x): `curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -` or `https://nodejs.org/en/download/` 
2. Install dependencies: `sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev git nodejs`. (For RaspberryPi usage)
3. Read more about [noble](https://github.com/noble/noble) for Windows and others OSes

## Installation
1. Clone the repository: git clone https://github.com/hamk-automation/node-red-thingy.git
2. `cd ./node-red-thingy`.
3. Install noble-device: `npm install noble-device --unsafe-perm`
4. `npm link`
5. Go to node-red root directory `cd ~/.node-red` or `cd C:\Users\my_name\.node_red`: `npm link node-red-thingy`
6. Run: `node-red-start`

