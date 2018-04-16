var Thingy = require('./index');
var enable=false;
var battery_enable=false;
var current_temp = null;
var current_hum = null;
var current_press = null;
var current_battery= null;
var current_eco2=null;
var current_tvoc=null;
var deviceName=null;
var duration;
function onTemperatureData(temperature,id) {
    current_temp = temperature;
    enable=true;
    deviceName=id
}
function onPressureData(pressure) {
    current_press= pressure;
}

function onHumidityData(humidity) {
    current_hum=humidity;
}
function onBatteryLevelChange(level) {
    current_battery= level;
    battery_enable=true;
}
function onGasData(gas) {
    current_eco2= gas.eco2;
    current_tvoc= gas.tvoc;
}


function onDiscover(thingy) {
  console.log('Discovered: ' + thingy);

  thingy.on('temperatureNotif', onTemperatureData);
  thingy.on('pressureNotif', onPressureData);
  thingy.on('humidityNotif', onHumidityData);
  thingy.on('gasNotif', onGasData);

  thingy.connectAndSetUp(function(error) {
    thingy.temperature_interval_set(duration, function(error) {
        if (error) {
            console.log('Temperature sensor configure! ' + error);
        }
    });
    thingy.pressure_interval_set(duration, function(error) {
        if (error) {
            console.log('Pressure sensor configure! ' + error);
        }
    });
    thingy.humidity_interval_set(duration, function(error) {
        if (error) {
            console.log('Humidity sensor configure! ' + error);
        }
    });
    thingy.gas_mode_set(1, function(error) {
        if (error) {
            console.log('Gas sensor configure! ' + error);
        }
    });

    thingy.temperature_enable();
    thingy.pressure_enable();
    thingy.humidity_enable();
    thingy.gas_enable();
    thingy.on('batteryLevelChange', onBatteryLevelChange);
    thingy.notifyBatteryLevel();
  });
}
module.exports = function(RED) {
    function ThingyNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        duration=config.time;
        Thingy.discover(onDiscover);

        setInterval(function(){
          if(enable&&battery_enable){
            var outMsg= {
              payload: {
                temperature: current_temp,
                humidity: current_hum,
                pressure: current_press,
                eco2: current_eco2,
                tvoc:current_tvoc,
                battery: current_battery,
                id: deviceName
              }
            };
           node.send(outMsg);
           enable=false;
         }
         }, duration);
    }
    RED.nodes.registerType("Thingy",ThingyNode);
}
