import { TestReporter } from "../src/reporters.ts";
import { ItNode, TestFunction } from "../src/nodes.ts";

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
