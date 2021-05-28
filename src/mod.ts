import { TestFunction } from "./nodes/mod.ts";
import { Environment } from "./environment.ts";

const env = new Environment();

function describeEach<CaseArgs extends unknown[]>(
  cases: CaseArgs[],
  getName: (...args: CaseArgs) => string,
  fn: (...args: CaseArgs) => void,
) {
  env.describeEach(cases, getName, fn);
}

function describeOnlyEach<CaseArgs extends unknown[]>(
  cases: CaseArgs[],
  getName: (...args: CaseArgs) => string,
  fn: (...args: CaseArgs) => void,
) {
  env.describeOnlyEach(cases, getName, fn);
}

function describeSkipEach<CaseArgs extends unknown[]>(
  cases: CaseArgs[],
  getName: (...args: CaseArgs) => string,
  fn: (...args: CaseArgs) => void,
) {
  env.describeSkipEach(cases, getName, fn);
}

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

function itEach<CaseArgs extends unknown[]>(
  cases: CaseArgs[],
  getName: (...args: CaseArgs) => string,
  fn: (...args: CaseArgs) => void | Promise<void>,
) {
  env.itEach(cases, getName, fn);
}

function itOnlyEach<CaseArgs extends unknown[]>(
  cases: CaseArgs[],
  getName: (...args: CaseArgs) => string,
  fn: (...args: CaseArgs) => void | Promise<void>,
) {
  env.itOnlyEach(cases, getName, fn);
}

function itSkipEach<CaseArgs extends unknown[]>(
  cases: CaseArgs[],
  getName: (...args: CaseArgs) => string,
  fn: (...args: CaseArgs) => void | Promise<void>,
) {
  env.itSkipEach(cases, getName, fn);
}

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
