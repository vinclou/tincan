<p align="center">
  <img src="./preview.png" widdth="80%" align="center"/>
  <h1 align="center">tincan</h1>
</p>

<p align="center">A lightweight Jest-like testing library for Deno</p>

## Features

- Nested suites / cases
- Reports cases with the full hierarchy
- Hooks (`beforeAll`, `afterAll`, `beforeEach`, `afterEach`)
- Focusing (`*.only()`)
- Skipping (`*.skip()`)
- Uses `Deno.test`, works with the built-in reporter
- Lightweight

## Running

```sh
deno test
```

## Usage

```ts
import {
  beforeEach,
  describe,
  expect,
  it,
  run,
} from "https://deno.land/x/tincan/mod.ts";

describe("Array", () => {
  let array: number[];

  beforeEach(() => {
    array = [];
  });

  describe("#indexOf", () => {
    it.only("should return -1 when the item isn't found", () => {
      expect(array.indexOf(0)).toBe(-1);
    });

    it("should return the index of the item", () => {
      array.push(0);
      expect(array.indexOf(0)).toBe(0);
    });
  });
});

run();
```
