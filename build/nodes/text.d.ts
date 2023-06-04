import { ICodePosition } from "../types.js";
import { HtmlNode } from "./node.js";
interface IHtmlTextConstructor {
    startPos: ICodePosition;
    endSeq?: string;
    parentTagName?: string;
}
declare class HtmlText extends HtmlNode {
    endSeq: string;
    constructor({ startPos, endSeq, parentTagName, }: IHtmlTextConstructor);
    toString(): string;
}
export { HtmlText };
