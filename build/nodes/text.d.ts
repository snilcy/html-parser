import { IPosition } from "../type.js";
import { HtmlNode } from "./node.js";
interface IHtmlTextConstructor {
    startPos: IPosition;
    endSeq?: string;
    parentTagName?: string;
}
declare class HtmlText extends HtmlNode {
    endSeq: string;
    constructor({ startPos, endSeq, parentTagName, }: IHtmlTextConstructor);
    toString(): string;
}
export { HtmlText };
