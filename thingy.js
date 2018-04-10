var Thingy = require('./index');
var current_temp = null;
var current_hum = null;
var current_press = null;
var duration;
function onTemperatureData(temperature) {
    current_temp = temperature;
}
function onPressureData(pressure) {
    current_press= pressure;
}

function onHumidityData(humidity) {
    current_hum=humidity;
}


function onDiscover(thingy) {
  console.log('Discovered: ' + thingy);

  thingy.on('temperatureNotif', onTemperatureData);
  thingy.on('pressureNotif', onPressureData);
  thingy.on('humidityNotif', onHumidityData);

  thingy.connectAndSetUp(function(error) {
    thingy.temperature_interval_set(duration, function(error) {
        if (error) {
            console.log('Temperature sensor configure! ' + error);
        }
    });
    thingy.pressure_interval_set(duration, function(error) {
        if (error) {
            c.log('Pressure sensor configure! ' + error);
        }
    });
    thingy.humidity_interval_set(duration, function(error) {
        if (error) {
            console.log('Humidity sensor configure! ' + error);
        }
    });

    thingy.temperature_enable(function(error) {
        console.log('Temperature sensor started! ' + ((error) ? error : ''));
    });
    thingy.pressure_enable(function(error) {
        console.log('Pressure sensor started! ' + ((error) ? error : ''));
    });
    thingy.humidity_enable(function(error) {
        console.log('Humidity sensor started! ' + ((error) ? error : ''));
    });
  });
}
module.exports = function(RED) {
    function ThingyNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        duration=config.time;
        Thingy.discover(onDiscover);

        setInterval(function(){
          var outMsg= {
            payload: {
              temperature: current_temp,
              humidity: current_hum,
              pressure: current_press
            }
          };
           node.send(outMsg)
         }, duration);

        node.on('node-input-time', function(msg) {
          console.log(msg);
        });
    }
    RED.nodes.registerType("Thingy",ThingyNode);
}
