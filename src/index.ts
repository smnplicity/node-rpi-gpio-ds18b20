import EventEmitter from "events";
import fs from "fs";
import { readFile } from "fs/promises";
import path from "path";

import parse from "./parser";

export type Unit = "C" | "F";

interface Options {
  deviceId: string;
  units: Unit;
  precision?: number;
}

export default class DS18B20 extends EventEmitter {
  private BASE_PATH = "/sys/bus/w1/devices";

  private options: Options;

  private lastValue: number | null = null;

  constructor(opts: Options) {
    super();
    this.options = opts;
  }

  connect = () => {
    const fullPath = path.join(
      this.BASE_PATH,
      this.options.deviceId,
      "w1_slave"
    );

    this.emit("debug", `${fullPath} exists: ${fs.existsSync(fullPath)}`);

    const poll = async () => {
      if (fs.existsSync(fullPath)) {
        const success = await this.parseDataAsync(fullPath);

        const wait = success ? 1000 : 3000;

        setTimeout(poll, wait);
      } else {
        this.emit(
          "error",
          new Error(
            `Device '${this.options.deviceId}' not found in '${fullPath}'. Retrying in 30 seconds.`
          )
        );
        setTimeout(poll, 30000);
      }
    };

    poll();

    return this;
  };

  on = (
    channel: "change" | "error" | "debug",
    listener: (...args: any[]) => void
  ) => {
    this.on(channel, listener);

    return this;
  };

  private parseDataAsync = async (path: string) => {
    try {
      if (fs.existsSync(path)) {
        const data = await readFile(path);
        const output = data.toString();

        let value = parse(output, this.options.units);

        if (value && this.options.precision)
          value = Number(value.toFixed(this.options.precision));

        if (value !== null && value !== this.lastValue) {
          this.emit("change", value);
          this.lastValue = value;
        }

        return value !== null;
      }
    } catch (e) {
      this.emit("error", e);
    }

    return false;
  };
}
