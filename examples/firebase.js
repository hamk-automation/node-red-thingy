
var Thingy = require('../index');
var util = require('util');
var firebase = require('firebase');
var thingy_id;

var firebase_login = {
    email : 'namtung.10cl2@gmail.com',
    pass : '@Aimabiet999'
};

var firebase_config = {
  apiKey: 'AIzaSyDMTLMd1hom-F_tugcI9f_76fTBrd2uu30',
  authDomain: "weatherstation-60f5e.firebaseapp.com",
  databaseURL: "https://weatherstation-60f5e.firebaseio.com",
  storageBucket: "weatherstation-60f5e.appspot.com",
};

var database;
var this_thingy;
var sigint = false;
var current_temp = 0;
var current_hum = 0;
var current_press = 0;

process.on('SIGINT', function () {
    sigint = true;
    console.log('Firebase signing out :');
    firebase.auth().signOut().then(function() {
        console.log('Firebase signed out!');
    }).catch(function(error) {
        console.log('Firebase sign out failed: ' + error.code + ' -' + error.message);
    });

    this_thingy.gas_disable(function(error) {
        console.log('Gas sensor stopped! ' + ((error) ? error : ''));
        this_thingy.disconnect(function(error){
            console.log('Disconnected: ' + ((error) ? error : ''));
            process.exit(1);
        });
    });
});

function firebaseWriteGasData(gas, temperature, humidity, pressure) {
    var date  = new Date()
    var ISOString = date.toISOString();
    var timestamp = ISOString.split('T')[0] + '/' + ISOString.split('T')[1].split('Z')[0].replace('.', '_');
    console.log(timestamp);
    firebase.database().ref('thingy/' + thingy_id + '/' + timestamp).set({
        eco2: gas.eco2,
        tvoc: gas.tvoc,
        temp: temperature,
        humidity: humidity,
        pressure: pressure,
    });
}

function onGasSensorData(gas) {
    console.log('Gas sensor: eCO2 ' + gas.eco2 + ' - TVOC ' + gas.tvoc )
    firebaseWriteGasData(gas, current_temp, current_hum,current_press);
}

function onTemperatureData(temperature) {
    current_temp = temperature;
}
function onPressureData(pressure) {
    current_press= pressure;
}

function onHumidityData(humidity) {
    current_hum=humidity;
}
function connectAndEnableGas(thingy) {
    thingy_id = thingy.id;
    this_thingy = thingy;
    thingy.connectAndSetUp(function(error) {
        console.log('Connected! ' + ((error) ? error : ''));
        thingy.gas_mode_set(3, function(error) {
            console.log('Gas sensor configured! ' + ((error) ? error : ''));
        });
        thingy.temperature_interval_set(5000, function(error) {
            if (error) {
                console.log('Temperature sensor configure! ' + error);
            }
        });
        thingy.pressure_interval_set(5000, function(error) {
            if (error) {
                console.log('Pressure sensor configure! ' + error);
            }
        });
        thingy.humidity_interval_set(5000, function(error) {
            if (error) {
                console.log('Humidity sensor configure! ' + error);
            }
        });
        thingy.gas_enable(function(error) {
            console.log('Gas sensor started! ' + ((error) ? error : ''));
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

function onDiscover(thingy) {
    console.log('Discovered: ' + thingy);

    thingy.on('disconnect', function() {
        if (!sigint) {
            console.log('Disconnected! Trying to reconnect');
            connectAndEnableGas(this);
        }
    });
    thingy.on('gasNotif', onGasSensorData);
    thingy.on('temperatureNotif', onTemperatureData);
    thingy.on('pressureNotif', onPressureData);
    thingy.on('humidityNotif', onHumidityData);
    connectAndEnableGas(thingy);
}

console.log('Firebase Thingy gas sensor!');

process.argv.forEach(function(val, index, array){
    if (val == '-a') {
        if (process.argv[index + 1]) {
            thingy_id = process.argv[index + 1];
        }
    }
});

firebase.initializeApp(firebase_config);

console.log('Firebase signing in as: ' + firebase_login.email);
firebase.auth().signInWithEmailAndPassword(firebase_login.email, firebase_login.pass).catch(function(error) {
    // Handle Errors here.
    console.log('Firebase sign in failed: ' + error.code + ' -' + error.message);
});

// Get a reference to the database service
database = firebase.database();

if (!thingy_id) {
    Thingy.discover(onDiscover);
}
else {
    Thingy.discoverById(thingy_id, onDiscover);
}
