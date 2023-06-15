import { Container } from "./container.js";
import { Group } from "./group.js";
import { Text } from "./text.js";

export class Node {
  public id: number;

  constructor(public parent: Container) {
    this.id = Node.lastId++;
  }

  static lastId = 0;
}
