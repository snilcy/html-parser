import { IListAttr, IObjAttr, ICodePosition } from "../types.js";
import { HtmlNode } from "./node.js";
declare class HtmlElement extends HtmlNode {
    private place;
    private closed;
    tagName: string;
    isCloseTag: boolean;
    selfClosed: boolean;
    childrens: HtmlNode[];
    attrsList: IListAttr[];
    attrs: IObjAttr;
    constructor(startPos?: ICodePosition);
    private afterTagName;
    private updateLastAttr;
    close: () => void;
    addChar: (char: string) => void;
    toString: () => string;
    buildClose: () => string;
}
export { HtmlElement };
