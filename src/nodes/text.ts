import { NodeType, TagToWrappers } from "../const.js";
import { IPosition } from "../type.js";
import { HtmlNode } from "./node.js";

interface IHtmlTextConstructor {
  startPos: IPosition;
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
    this.groupChars = TagToWrappers[parentTagName] || [];
  }

  public toString() {
    return this.content;
  }
}

export { HtmlText };
