# @node-rpi-gpio/ds18b20
A simple event based NodeJS module for reading temperature using a DS18B20 on a Raspberry PI.

## Installation
```
npm i @node-rpi-gpio/ds18b20
```

## Usage
### Subscribe to temperature change events
```
const ds18b20 = new DS18B20({ deviceId: "28-3c46e381ef0a", units: "C", precision: 1 })
  .on("error", (err: string | Error) => {
    // Log or display an error.
  })
  .on("change", (changedValue: number) => {
    
  })
  .connect();
```
