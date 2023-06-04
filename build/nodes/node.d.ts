import type { IGroup, ICodePosition, ICodeRange } from "../types.js";
import { NodeType } from "../const.js";
import { HtmlElement } from "./element.js";
import { HtmlText } from "./text.js";
declare class HtmlNode {
    static lastId: number;
    id: number;
    groups: IGroup[];
    inGroup: boolean;
    content: string;
    parent: HtmlElement | null;
    pos: ICodeRange;
    protected groupChars: string[];
    private type;
    private needCloseGroup;
    constructor(startPos?: ICodePosition, type?: NodeType);
    isElement(): this is HtmlElement;
    isText(): this is HtmlText;
    get isRoot(): boolean;
    get isNode(): boolean;
    get isGroupStarted(): boolean;
    get isGroupEnded(): boolean;
    addChar(char: string): void;
    private get lastGroup();
    private needCloseGroupHandler;
    private closeGroupHandler;
    private newGroupHandler;
    private updateGroupHandler;
}
export { HtmlNode };
