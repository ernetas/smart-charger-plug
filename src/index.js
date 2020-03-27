const config = require('config');
const batteryLevel = require('battery-level');
const TuyAPI = require('tuyapi');
const fs = require('fs');
const { execFileSync } = require('child_process');
const logger = require('pino')();

const plugConfig = config.get('plug');
const device = new TuyAPI(plugConfig);

// Add debug option
// Add option to start/stop socket forcefully
// Add option to charge fully
// Charge to 80% in the morning

async function switchDevice(toState) {
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
    logger.info(`Battery level: ${levelPercent}`);
    if (isHome()) {
      const chargingStatus = isCharging();
      logger.info(`We're home. Charging: ${chargingStatus}`);
      if ((levelPercent < 50) && (!chargingStatus)) {
        switchDevice(true);
      } else if ((levelPercent > 65) && chargingStatus) {
        switchDevice(false);
      }
    }
  });
}, 60000);
