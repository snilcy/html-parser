import { Node } from "./node.js";

export class Text extends Node {
  public content = "";

  public addChar(char: string) {
    this.content += char;
  }
}
