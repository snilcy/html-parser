import { NodeType, TagToWrappers } from "../const.js";
import { HtmlNode } from "./node.js";
class HtmlText extends HtmlNode {
    endSeq = "";
    constructor({ startPos, endSeq = "", parentTagName = "", }) {
        super(startPos, NodeType.TEXT);
        this.endSeq = endSeq;
        this.groupChars = TagToWrappers[parentTagName] || [];
    }
    toString() {
        return this.content;
    }
}
export { HtmlText };
