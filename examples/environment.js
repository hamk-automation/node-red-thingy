var Thingy = require('../index');
var enabled;

console.log('Reading Thingy environment sensors!');

function onTemperatureData(temperature) {
    console.log('Temperature sensor: ' + temperature);
}

function onPressureData(pressure) {
    console.log('Pressure sensor: ' + pressure);
}

function onHumidityData(humidity) {
    console.log('Humidity sensor: ' + humidity);
}

function onDiscover(thingy) {
  console.log('Discovered: ' + thingy);

  thingy.on('disconnect', function() {
    console.log('Disconnected!');
  });
  thingy.on('temperatureNotif', onTemperatureData);
  thingy.on('pressureNotif', onPressureData);
  thingy.on('humidityNotif', onHumidityData);
  thingy.connectAndSetUp(function(error) {
    console.log('Setting up');

  thingy.temperature_interval_set(1000, function(error) {
      if (error) {
          console.log('Temperature sensor configure! ' + error);
      }
  });

  thingy.pressure_interval_set(1000, function(error) {
      if (error) {
          console.log('Pressure sensor configure! ' + error);
      }
  });

  thingy.humidity_interval_set(1000, function(error) {
      if (error) {
          console.log('Humidity sensor configure! ' + error);
      }
  });

    enabled = true;

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

Thingy.discover(onDiscover);
