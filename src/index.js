const config = require('config');
const batteryLevel = require('battery-level');
const TuyAPI = require('tuyapi');
const fs = require('fs');
const { execFileSync } = require('child_process');
const logger = require('pino')();

const plugs = config.get('plugs');

async function switchDevice(toState, device) {
  logger.info(`Switching device to: ${toState}`);
  await device.find();
  await device.connect();
  let status = await device.get();
  logger.info(`Current status: ${status}.`);
  await device.set({ set: toState });
  status = await device.get();
  logger.info(`New status: ${status}.`);
  device.disconnect();
}

async function switchAllDevices(toState) {
  plugs.forEach((plugConfig) => {
    switchDevice(toState, new TuyAPI(plugConfig));
  });
}

function isCharging() {
  const chargingState = fs.readFileSync('/sys/class/power_supply/BAT0/status', 'utf8').trim();
  if ((chargingState === 'Charging') || (chargingState === 'Full')) {
    return true;
  }
  return false;
}

function isHome() {
  const stdout = execFileSync('iwgetid', ['-r'], { encoding: 'utf-8' });
  if (stdout.trim() === 'sun') {
    return true;
  }
  return false;
}

setInterval(() => {
  batteryLevel().then((level) => {
    const levelPercent = Math.round(parseFloat(level) * 100);
    logger.info(`Battery level: ${levelPercent}%`);
    if (isHome()) { // Only operate at home, as the plug can only access home WiFi
      const chargingStatus = isCharging();
      logger.info(`Charging: ${chargingStatus}`);
      if ((levelPercent < 50) && (!chargingStatus)) {
        switchAllDevices(true);
      } else if ((levelPercent > 65) && chargingStatus) {
        switchAllDevices(false);
      }
    }
  });
}, 60000);
