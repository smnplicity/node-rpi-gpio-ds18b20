import EventEmitter from "events";
import fs from "fs";
import { readFile } from "fs/promises";
import path from "path";

import parse from "./parser";

export type Unit = "C" | "F";

interface Options {
  deviceId: string;
  units: Unit;
}

export default class DS18B20 {
  private BASE_PATH = "/sys/bus/w1/devices";

  private emitter = new EventEmitter();

  private options: Options;

  private lastValue: number | null = null;

  constructor(opts: Options) {
    this.options = opts;
  }

  connect = () => {
    const fullPath = path.join(
      this.BASE_PATH,
      this.options.deviceId,
      "w1_slave"
    );

    this.emitter.emit(
      "debug",
      `${fullPath} exists: ${fs.existsSync(fullPath)}`
    );

    if (fs.existsSync(fullPath)) {
      const poll = async () => {
        const success = await this.parseDataAsync(fullPath);

        const wait = success ? 1000 : 3000;

        setTimeout(poll, wait);
      };

      poll();
    } else {
      this.emitter.emit("error", new Error("Device Id not found."));
    }

    return this;
  };

  on = (
    channel: "change" | "error" | "debug",
    listener: (...args: any[]) => void
  ) => {
    this.emitter.on(channel, listener);

    return this;
  };

  private parseDataAsync = async (path: string) => {
    try {
      if (fs.existsSync(path)) {
        const data = await readFile(path);
        const output = data.toString();

        const value = parse(output, this.options.units);

        if (value !== null && value !== this.lastValue) {
          this.emitter.emit("change", value);
          this.lastValue = value;
        }

        return value !== null;
      }
    } catch (e) {
      this.emitter.emit("error", e);
    }

    return false;
  };
}
