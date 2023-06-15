import { Container } from "./container.js";
import { Node } from "./node.js";
import { Text } from "./text.js";

export class List extends Node {
  items: (List | Text)[] = [];

  constructor(parent: Container, public delimetr: string) {
    super(parent);
  }
}
