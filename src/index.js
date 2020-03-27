const config = require('config');
const batteryLevel = require('battery-level');
const TuyAPI = require('tuyapi');
const fs = require('fs')

const plugConfig = config.get('plug');
const device = new TuyAPI(plugConfig);

// Add debug option
// Add option to start/stop socket forcefully
// Add option to charge fully
// Charge to 80% in the morning

async function switchDevice(toState) {
  console.log(`Switching device to: ${toState}`);
  await device.find();
  await device.connect();
  let status = await device.get();
  console.log(`Current status: ${status}.`);
  await device.set({set: toState});
  status = await device.get();
  console.log(`New status: ${status}.`);
  device.disconnect();
}

function isCharging() {
  var chargingState = fs.readFileSync('/sys/class/power_supply/BAT0/status', 'utf8').trim();
  if ((chargingState == "Charging") || (chargingState == "Full")) {
    return true;
  }
  return false;
}

function notCharging() {
  if (isCharging()) {
    return false;
  }
  return true;
}

function isHome() {
  const { execFileSync } = require('child_process');
  const stdout = execFileSync('iwgetid', ['-r'],  {encoding: 'utf-8'});
  if (stdout.trim() == "sun") {
    return true;
  }
  return false;
}

setInterval(() => {
  batteryLevel().then(level => {
    levelPercent = Math.round(parseFloat(level)*100);
    console.log(`Battery level: ${levelPercent}`);
    if (isHome()) {
      console.log(`We're home. Charging: `);
      console.log(isCharging());
      if ((levelPercent < 50) && notCharging()) {
        switchDevice(true);
      } else if ((levelPercent > 65) && isCharging()) {
        switchDevice(false);
      }
    }
  });
}, 5000)

