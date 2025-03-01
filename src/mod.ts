import { TestFunction } from "./nodes/mod.ts";
import { Environment } from "./environment.ts";

const env = new Environment();

export function describe(headline: string, fn: () => void) {
  env.describe(headline, fn);
}

describe.only = function (headline: string, fn: () => void) {
  env.describeOnly(headline, fn);
};

describe.skip = function (headline: string, fn: () => void) {
  env.describeSkip(headline, fn);
};

export function it(headline: string, fn: TestFunction) {
  env.it(headline, fn);
}

it.only = function (headline: string, fn: TestFunction) {
  env.itOnly(headline, fn);
};

it.skip = function (headline: string, fn: TestFunction) {
  env.itSkip(headline, fn);
};

export function beforeAll(fn: TestFunction) {
  env.beforeAll(fn);
}

export function beforeEach(fn: TestFunction) {
  env.beforeEach(fn);
}

export function afterEach(fn: TestFunction) {
  env.afterEach(fn);
}

export function afterAll(fn: TestFunction) {
  env.afterAll(fn);
}

export function run() {
  env.run();
}

export { expect, mock } from "./deps.ts";
