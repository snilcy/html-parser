import { last, lastIndex, updateById } from "@snilcy/cake";
import { Char } from "../const.js";
import { ICodePosition } from "./types.js";

class Code {
  public lines: string[] = [""];

  private addToLastLine = (char: string) => {
    updateById(
      this.lines,
      lastIndex(this.lines),
      (line: string) => line + char
    );
  };

  get col() {
    return last(this.lines)?.length || 1;
  }

  get line() {
    return this.lines.length || 1;
  }

  get pos(): ICodePosition {
    return {
      col: this.col,
      line: this.line,
    };
  }

  addChar = (char: string) => {
    if (char === Char.NEW_LINE) {
      this.newLine();
    } else {
      this.addToLastLine(char);
    }
  };

  newLine = () => {
    this.lines.push("");
  };
}

export { Code };
