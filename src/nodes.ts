export type TestResult = "FAIL" | "PASS";

export type TestFunction = () => void | Promise<void>;

type HookType =
  | "internal"
  | "beforeAll"
  | "beforeEach"
  | "afterEach"
  | "afterAll";

type ParentNode = {
  children: (DescribeNode | ItNode)[];
  hasFocused: boolean;
  updateFocusedChildren: () => void;
};

type ChildNode = {
  parent: DescribeNode | RootNode;
  skipped: boolean;
  focused: boolean;
  skip: () => void;
  focus: () => void;
};

function assertNotEmpty(headline: string) {
  if (!headline.match(/\S/g)) {
    throw new Error("Headline cannot be empty!");
  }
}

function hasCase(node: DescribeNode | RootNode): boolean {
  for (const child of node.children) {
    if (child instanceof ItNode) {
      if (!child.skipped) {
        return true;
      }
    } else if (hasCase(child)) {
      return true;
    }
  }
  return false;
}

function assertHasCase(node: DescribeNode | RootNode, method: string) {
  if (!hasCase(node)) {
    throw new Error(`${method} should have at least one test case!`);
  }
}

export class Hook {
  type: HookType;
  fn: TestFunction;
  constructor(type: HookType, fn: TestFunction) {
    this.type = type;
    this.fn = fn;
  }
}

export class RootNode implements ParentNode {
  children: (DescribeNode | ItNode)[] = [];
  beforeAll: Hook[] = [];
  afterAll: Hook[] = [];
  beforeEach: Hook[] = [];
  afterEach: Hook[] = [];
  result: TestResult = "PASS";
  timeTaken = 0;
  startTime = 0;
  hasFocused = false;

  updateFocusedChildren() {
    this.hasFocused = true;
    this.children.forEach((child) => {
      if (child.focused === false) {
        child.skip();
      }
    });
  }

  start() {
    assertHasCase(this, "Tests");
    this.startTime = Date.now();
  }

  fail() {
    this.result = "FAIL";
  }

  finish() {
    this.timeTaken = Date.now() - this.startTime;
  }
}

export class DescribeNode implements ParentNode, ChildNode {
  children: (DescribeNode | ItNode)[] = [];
  parent: RootNode | DescribeNode;
  headline: string;
  result: TestResult = "PASS";
  beforeAll: Hook[] = [];
  afterAll: Hook[] = [];
  beforeEach: Hook[] = [];
  afterEach: Hook[] = [];
  skipped = false;
  focused = false;
  hasFocused = false;

  constructor(headline: string, parent: RootNode | DescribeNode) {
    assertNotEmpty(headline);
    this.headline = headline;
    this.parent = parent;
  }

  skip() {
    this.skipped = true;
    this.children.forEach((child) => child.skip());
  }

  focus() {
    this.focused = true;
    this.parent.updateFocusedChildren();
  }

  updateFocusedChildren() {
    this.hasFocused = true;
    this.children.forEach((child) => {
      if (child.focused === false) {
        child.skip();
      }
    });
  }

  fail() {
    this.result = "FAIL";
    this.parent.fail();
  }
}

export class ItNode implements ChildNode {
  parent: DescribeNode | RootNode;
  headline: string;
  fn: TestFunction;
  result: TestResult = "PASS";
  error: unknown;
  timeTaken = 0;
  startTime = 0;
  skipped = false;
  focused = false;

  constructor(
    headline: string,
    fn: TestFunction,
    parent: DescribeNode | RootNode,
  ) {
    assertNotEmpty(headline);
    this.parent = parent;
    this.headline = headline;
    this.fn = fn;
  }

  skip() {
    this.skipped = true;
  }

  focus() {
    this.focused = true;
    this.parent.updateFocusedChildren();
  }

  start() {
    this.startTime = Date.now();
  }

  fail(error?: unknown) {
    this.result = "FAIL";
    this.error = error;
    this.parent.fail();
  }

  finish() {
    this.timeTaken = Date.now() - this.startTime;
  }
}

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
