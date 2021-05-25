import { TestReporter } from "./reporter.ts";
import { Runner } from "./runner.ts";
import { ItNode, TestFunction } from "./nodes.ts";

export class SilentReporter implements TestReporter {
  reportStart() {}
  reportEnd() {}
  reportHookError() {}
  reportCase() {}
}

export async function silentTest(node: ItNode, wrappedFn: TestFunction) {
  if (!node.skipped) {
    await wrappedFn();
  }
}

export class SilentRunner extends Runner {
  test = silentTest;
  reporter = new SilentReporter();
  constructor() {
    super();
  }
}
