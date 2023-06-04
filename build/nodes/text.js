import { NodeType, TagToWrappers } from "../const.js";
import { HtmlNode } from "./node.js";
class HtmlText extends HtmlNode {
    endSeq = "";
    constructor({ startPos, endSeq = "", parentTagName = "", }) {
        super(startPos, NodeType.TEXT);
        this.endSeq = endSeq;
        if (parentTagName) {
            this.groupChars = TagToWrappers[parentTagName];
        }
        else {
            this.groupChars = [];
        }
    }
    toString() {
        return this.content;
    }
}
export { HtmlText };
