const batteryLevel = require('battery-level');
 
batteryLevel().then(level => {
    console.log(level);
    //=> 0.55
});
