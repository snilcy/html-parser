import { NodeType, TagToWrappers } from "../const.js";
import { ICodePosition } from "../types.js";
import { HtmlNode } from "./node.js";

interface IHtmlTextConstructor {
  startPos: ICodePosition;
  endSeq?: string;
  parentTagName?: string;
}

class HtmlText extends HtmlNode {
  public endSeq = "";

  constructor({
    startPos,
    endSeq = "",
    parentTagName = "",
  }: IHtmlTextConstructor) {
    super(startPos, NodeType.TEXT);

    this.endSeq = endSeq;

    if (parentTagName) {
      this.groupChars = TagToWrappers[parentTagName];
    } else {
      this.groupChars = [];
    }
  }

  public toString() {
    return this.content;
  }
}

export { HtmlText };
