import { assert } from "chai";

import parse from "../src/parser";

describe("Parser Tests", () => {
  it("available should return 20 degrees celcius", () => {
    const output = `42 01 55 05 7f a5 a5 66 bd : crc=bd YES
    42 01 55 05 7f a5 a5 66 bd t=20000`;

    const result = parse(output, "C");

    assert.isTrue(result === 20);
  });

  it("available should return 68 degrees fahrenheit", () => {
    const output = `42 01 55 05 7f a5 a5 66 bd : crc=bd YES
    42 01 55 05 7f a5 a5 66 bd t=20000`;

    const result = parse(output, "C");

    assert.isTrue(result === 20);
  });

  it("unavailable should return null", () => {
    const output = `42 01 55 05 7f a5 a5 66 bd : crc=bd NO
    42 01 55 05 7f a5 a5 66 bd t=20000`;

    const result = parse(output, "C");

    assert.isTrue(result === null);
  });

  it("invalid number should return null", () => {
    const output = `42 01 55 05 7f a5 a5 66 bd : crc=bd YES
    42 01 55 05 7f a5 a5 66 bd t=a`;

    const result = parse(output, "C");

    assert.isTrue(result === null);
  });
});
