import { HtmlNode } from "./nodes/node.js";
import { HtmlElement } from "./nodes/element.js";
declare class HtmlParser {
    #private;
    private code;
    private currentNode;
    rawHtml: string;
    tree: HtmlElement;
    nodes: HtmlNode[];
    constructor(rawHtml: string);
    pushNode: () => void;
    nodeInGroupHandler: (char: string) => void;
    textNodeWithEndSeqHandler: (char: string, i: number) => void;
    openAngleBracketHandler: () => void;
    closeAngleBracketHandler: () => void;
    parse: () => void;
    buildTree: () => void;
    buildHtml: () => string;
}
export { HtmlParser };
