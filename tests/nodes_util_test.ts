/*

getAncestry
  returns a node's describe ancestors starting from the highest

findChildWithFirstCase
  finds the child that will run the first case

findChildWithLastCase
  finds the child that will run the last case

*/

import { DescribeNode, ItNode, RootNode, Tree } from "../src/nodes.ts";
import {
  findChildWithFirstCase,
  findChildWithLastCase,
  getAncestry,
} from "../src/nodes_util.ts";
import { expect } from "https://deno.land/x/expect@v0.2.9/mod.ts";

function noop() {}

Deno.test("getAncestry returns a node's describe ancestors starting from the highest", () => {
  const firstNode = new DescribeNode("_", new RootNode());
  const secondNode = new DescribeNode("_", firstNode);
  expect(getAncestry(new ItNode("_", noop, secondNode))).toEqual([
    firstNode,
    secondNode,
  ]);
});

function findChildEnv() {
  const tree = new Tree();

  tree.describeSkip("_", () => {
    tree.it("_", noop);
  });

  const first = tree.addDescribeNode("_", () => {
    tree.it("_", noop);
  });

  const last = tree.addDescribeNode("_", () => {
    tree.itSkip("_", noop);
    tree.it("_", noop);
  });

  return { tree, first, last };
}

Deno.test("findChildWithFirstCase finds the child that will run the first case", () => {
  const { tree, first } = findChildEnv();
  expect(findChildWithFirstCase(tree.root)).toBe(first);
});

Deno.test("findChildWithLastCase finds the child that will run the first case", () => {
  const { tree, last } = findChildEnv();
  expect(findChildWithLastCase(tree.root)).toBe(last);
});
