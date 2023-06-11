import os from "os";

import { Unit } from ".";

const parse = (output: string, units: Unit) => {
  if (!output) return null;

  const lines = output.split(os.EOL);

  if (lines.length < 2) return null;

  const firstLine = lines[0].split(" ");

  if (firstLine.length === 0) return null;

  const available = firstLine[firstLine.length - 1] === "YES";

  if (available) {
    const secondLine = lines[1].split(" ");

    if (secondLine.length === 0) return null;

    const rawValue = secondLine[secondLine.length - 1];

    if (rawValue === undefined) return null;

    const rawTemperature = rawValue.split("=")[1];

    const temperature = Number(rawTemperature);

    if (isNaN(temperature)) return null;

    const celcius = temperature / 1000;

    switch (units) {
      case "F":
        return celcius * 1.8 + 32;
      default:
        return celcius;
    }
  }

  return null;
};

export default parse;
