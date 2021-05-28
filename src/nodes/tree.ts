import {
  assertHasCase,
  DescribeNode,
  Hook,
  ItNode,
  RootNode,
  TestFunction,
} from "./nodes.ts";

export type EachMethod<Returns> = <CaseArgs extends unknown[]>(
  cases: CaseArgs[],
  getName: (...args: CaseArgs) => string,
  fn: (...args: CaseArgs) => Returns,
) => void;

export class Tree {
  root: RootNode = new RootNode();
  private currentNode: RootNode | DescribeNode = this.root;

  addDescribeNode(headline: string, fn: () => void) {
    const parent = this.currentNode;
    const node = new DescribeNode(headline, parent);
    parent.children.push(node);
    this.currentNode = node;
    fn();
    assertHasCase(node, "describe()");
    this.currentNode = parent;
    return node;
  }

  describe(headline: string, fn: () => void) {
    const node = this.addDescribeNode(headline, fn);
    if (node.parent.hasFocused) {
      node.skip();
    }
  }

  describeSkip(headline: string, fn: () => void) {
    this.addDescribeNode(headline, fn).skip();
  }

  describeOnly(headline: string, fn: () => void) {
    this.addDescribeNode(headline, fn).focus();
  }

  describeEach<CaseArgs extends unknown[]>(
    cases: CaseArgs[],
    getName: (...args: CaseArgs) => string,
    fn: (...args: CaseArgs) => void | Promise<void>,
  ) {
    for (const caseArgs of cases) {
      this.describe(getName(...caseArgs), () => fn(...caseArgs));
    }
  }

  describeSkipEach<CaseArgs extends unknown[]>(
    cases: CaseArgs[],
    getName: (...args: CaseArgs) => string,
    fn: (...args: CaseArgs) => void | Promise<void>,
  ) {
    for (const caseArgs of cases) {
      this.describeSkip(getName(...caseArgs), () => fn(...caseArgs));
    }
  }

  describeOnlyEach<CaseArgs extends unknown[]>(
    cases: CaseArgs[],
    getName: (...args: CaseArgs) => string,
    fn: (...args: CaseArgs) => void | Promise<void>,
  ) {
    for (const caseArgs of cases) {
      this.describeOnly(getName(...caseArgs), () => fn(...caseArgs));
    }
  }

  addItNode(headline: string, fn: TestFunction) {
    const parent = this.currentNode;
    const node = new ItNode(headline, fn, parent);
    parent.children.push(node);
    return node;
  }

  it(headline: string, fn: TestFunction) {
    const node = this.addItNode(headline, fn);
    if (node.parent.hasFocused) {
      node.skip();
    }
  }

  itSkip(headline: string, fn: TestFunction) {
    this.addItNode(headline, fn).skip();
  }

  itOnly(headline: string, fn: TestFunction) {
    this.addItNode(headline, fn).focus();
  }

  itEach<CaseArgs extends unknown[]>(
    cases: CaseArgs[],
    getName: (...args: CaseArgs) => string,
    fn: (...args: CaseArgs) => void | Promise<void>,
  ) {
    for (const caseArgs of cases) {
      this.it(getName(...caseArgs), () => fn(...caseArgs));
    }
  }

  itOnlyEach<CaseArgs extends unknown[]>(
    cases: CaseArgs[],
    getName: (...args: CaseArgs) => string,
    fn: (...args: CaseArgs) => void | Promise<void>,
  ) {
    for (const caseArgs of cases) {
      this.itOnly(getName(...caseArgs), () => fn(...caseArgs));
    }
  }

  itSkipEach<CaseArgs extends unknown[]>(
    cases: CaseArgs[],
    getName: (...args: CaseArgs) => string,
    fn: (...args: CaseArgs) => void | Promise<void>,
  ) {
    for (const caseArgs of cases) {
      this.itSkip(getName(...caseArgs), () => fn(...caseArgs));
    }
  }

  beforeAll(fn: TestFunction) {
    this.currentNode.beforeAll.push(new Hook("beforeAll", fn));
  }

  beforeEach(fn: TestFunction) {
    this.currentNode.beforeEach.push(new Hook("beforeEach", fn));
  }

  afterEach(fn: TestFunction) {
    this.currentNode.afterEach.unshift(new Hook("afterEach", fn));
  }

  afterAll(fn: TestFunction) {
    this.currentNode.afterAll.unshift(new Hook("afterAll", fn));
  }
}
