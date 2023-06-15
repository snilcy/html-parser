import { Node } from "./node.js";
export class Text extends Node {
    content = "";
    addChar(char) {
        this.content += char;
    }
}
//# sourceMappingURL=text.js.map