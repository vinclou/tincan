/*

Environment.setReporter
  sets the reporter

Environment.run
  replaces the tree
  can run again when the previous run finishes
  sets the runner's reporter to its reporter

Environment
  refuses to add hooks within a test case
  refuses to add nodes within a test case

*/

import { Environment } from "../src/environment.ts";
import { SilentReporter, silentTest } from "./test_util.ts";
import { expect } from "https://deno.land/x/expect@v0.2.6/mod.ts";

function noop() {}

function createTestEnvironment() {
  const env = new Environment();
  env.runner.test = silentTest;
  env.setReporter(new SilentReporter());
  return env;
}

Deno.test("Environment.setReporter sets the reporter", () => {
  const env = new Environment();
  const reporter = new SilentReporter();
  env.setReporter(reporter);
  expect(env.runner.reporter).toBe(reporter);
});

Deno.test("Environment.run replaces the tree", async () => {
  const env = createTestEnvironment();
  const tree = env.currentTree;
  env.it("_", noop);
  await env.run();
  expect(env.currentTree).not.toBe(tree);
});

Deno.test("Environment.run can run again when the previous run finishes", async () => {
  const env = createTestEnvironment();
  env.it("_", noop);
  await env.run();

  expect(() => {
    env.it("_", noop);
    env.run();
  }).not.toThrow();
});

Deno.test("Environment.run sets the runner's reporter to its reporter", async () => {
  const env = createTestEnvironment();
  const reporter = new SilentReporter();
  env.setReporter(reporter);

  env.it("_", noop);
  await env.run();

  expect(env.runner.reporter).toBe(reporter);
});

Deno.test("Environment refuses to add hooks within a test case", async () => {
  const env = createTestEnvironment();

  env.it("_", () => {
    expect(() => {
      env.beforeAll(noop);
    }).toThrow();

    expect(() => {
      env.beforeEach(noop);
    }).toThrow();

    expect(() => {
      env.afterEach(noop);
    }).toThrow();

    expect(() => {
      env.afterAll(noop);
    }).toThrow();
  });

  await env.run();
});

Deno.test("Environment refuses to add nodes within a test case", async () => {
  const env = createTestEnvironment();

  env.it("_", () => {
    expect(() => {
      env.it("_", noop);
    }).toThrow();

    expect(() => {
      env.describe("_", () => {
        env.it("_", noop);
      });
    }).toThrow();
  });

  await env.run();
});
