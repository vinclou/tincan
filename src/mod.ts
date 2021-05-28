import { EachMethod, TestFunction } from "./nodes/mod.ts";
import { Environment } from "./environment.ts";

const env = new Environment();

const describeEach: EachMethod<void> = (cases, getName, fn) => {
  env.describeEach(cases, getName, fn);
};

const describeOnlyEach: EachMethod<void> = (cases, getName, fn) => {
  env.describeOnlyEach(cases, getName, fn);
};

const describeSkipEach: EachMethod<void> = (cases, getName, fn) => {
  env.describeSkipEach(cases, getName, fn);
};

function describeOnly(headline: string, fn: () => void) {
  env.describeOnly(headline, fn);
}

function describeSkip(headline: string, fn: () => void) {
  env.describeSkip(headline, fn);
}

describeOnly.each = describeOnlyEach;
describeSkip.each = describeSkipEach;

export function describe(headline: string, fn: () => void) {
  env.describe(headline, fn);
}

describe.only = describeOnly;
describe.skip = describeSkip;
describe.each = describeEach;

const itEach: EachMethod<void | Promise<void>> = (cases, getName, fn) => {
  env.itEach(cases, getName, fn);
};

const itOnlyEach: EachMethod<void | Promise<void>> = (cases, getName, fn) => {
  env.itOnlyEach(cases, getName, fn);
};

const itSkipEach: EachMethod<void | Promise<void>> = (cases, getName, fn) => {
  env.itSkipEach(cases, getName, fn);
};

function itOnly(headline: string, fn: TestFunction) {
  env.itOnly(headline, fn);
}

function itSkip(headline: string, fn: TestFunction) {
  env.itSkip(headline, fn);
}

itOnly.each = itOnlyEach;
itSkip.each = itSkipEach;

export function it(headline: string, fn: TestFunction) {
  env.it(headline, fn);
}

it.skip = itSkip;
it.only = itOnly;
it.each = itEach;

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
