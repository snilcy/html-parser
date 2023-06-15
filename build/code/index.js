import { last, lastIndex, updateById } from "@snilcy/cake";
import { Char } from "../const.js";
class Code {
    lines = [""];
    addToLastLine = (char) => {
        updateById(this.lines, lastIndex(this.lines), (line) => line + char);
    };
    get col() {
        return last(this.lines)?.length || 1;
    }
    get line() {
        return this.lines.length || 1;
    }
    get pos() {
        return {
            col: this.col,
            line: this.line,
        };
    }
    addChar = (char) => {
        if (char === Char.NEW_LINE) {
            this.newLine();
        }
        else {
            this.addToLastLine(char);
        }
    };
    newLine = () => {
        this.lines.push("");
    };
}
export { Code };
//# sourceMappingURL=index.js.map