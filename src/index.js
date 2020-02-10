const config = require('config');
const batteryLevel = require('battery-level');
const TuyAPI = require('tuyapi');
const fs = require('fs')

const plugConfig = config.get('plug');
const device = new TuyAPI(plugConfig);

function switchDevice(toState) {
  console.log(`Switching device to: ${toState}`);
  device.find().then(() => {
    device.connect();
  });
  device.on('data', data => {
    if (data.dps['1'] !== toState) {
      device.set({set: toState});
    }
  });
  setTimeout(() => { device.disconnect(); }, 5000);
}

function isCharging() {
  var chargingState = fs.readFileSync('/sys/class/power_supply/BAT0/status', 'utf8').trim();
  if (chargingState == "Charging") {
    return true
  }
  return false
}

function notCharging() {
  if (isCharging()) {
    return false
  }
  return true
}

function isHome() {
  const { execFileSync } = require('child_process');
  const stdout = execFileSync('iwgetid', ['-r'],  {encoding: 'utf-8'});
  if (stdout.trim() == "sun") {
    return true
  }
  return false
}

setInterval(() => {
  batteryLevel().then(level => {
    levelPercent = Math.round(parseFloat(level)*100);
    if (isHome()) {
      // console.log(levelPercent)
      // console.log(isCharging())
      if ((levelPercent < 31) && notCharging()) {
        switchDevice(true);
      } else if ((levelPercent > 80) && isCharging()) {
        switchDevice(false);
      }
    }
  });
}, 10000)

