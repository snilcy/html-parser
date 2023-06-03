/* eslint-disable @typescript-eslint/no-unused-vars */
import { first, last } from "@snilcy/cake";
import { Char, RawContentTags } from "./const.js";
import { HtmlNode } from "./nodes/node.js";
import { HtmlElement } from "./nodes/element.js";
import { HtmlText } from "./nodes/text.js";
import { logger } from "./logger.js";
import { Code } from "./code.js";
const log = logger.ns("P");
class HtmlParser {
    code = new Code();
    currentNode = new HtmlNode();
    rawHtml = "";
    tree = new HtmlElement();
    nodes = [];
    constructor(rawHtml) {
        this.rawHtml = rawHtml;
        this.parse();
        this.buildTree();
    }
    pushNode = () => {
        this.currentNode.pos.end = this.code.pos;
        if (this.currentNode.isElement()) {
            this.currentNode.close();
        }
        this.nodes.push(this.currentNode);
    };
    nodeInGroupHandler = (char) => {
        this.currentNode.addChar(char);
    };
    textNodeWithEndSeqHandler = (char, i) => {
        const { endSeq } = this.currentNode;
        if (first([...endSeq]) === char &&
            last([...endSeq]) === this.rawHtml[i + endSeq.length - 1] &&
            this.rawHtml.slice(i, i + endSeq.length) === endSeq) {
            this.pushNode();
            this.currentNode = new HtmlElement(this.code.pos);
            return;
        }
        this.currentNode.addChar(char);
    };
    openAngleBracketHandler = () => {
        if (this.currentNode.isText()) {
            this.pushNode();
        }
        this.currentNode = new HtmlElement(this.code.pos);
    };
    closeAngleBracketHandler = () => {
        this.pushNode();
        this.#afterTagCloseHandler();
    };
    parse = () => {
        for (let i = 0; i < this.rawHtml.length; i++) {
            const char = this.rawHtml[i];
            this.code.addChar(char);
            if (this.currentNode.inGroup) {
                this.nodeInGroupHandler(char);
                continue;
            }
            if (this.currentNode.isText() && this.currentNode.endSeq) {
                this.textNodeWithEndSeqHandler(char, i);
                continue;
            }
            if (char === Char.BRACKET_ANGLE_OPEN) {
                this.openAngleBracketHandler();
                continue;
            }
            if (char === Char.BRACKET_ANGLE_CLOSE) {
                this.closeAngleBracketHandler();
                continue;
            }
            if (this.currentNode.isNode) {
                this.currentNode = new HtmlText({
                    startPos: this.code.pos,
                });
            }
            this.currentNode.addChar(char);
        }
    };
    #afterTagCloseHandler = () => {
        const lastNode = last(this.nodes);
        if (lastNode && lastNode.isElement()) {
            const isOpenRawContentTag = !lastNode.isCloseTag && RawContentTags.includes(lastNode.tagName);
            if (isOpenRawContentTag) {
                this.currentNode = new HtmlText({
                    startPos: this.code.pos,
                    endSeq: [Char.BRACKET_ANGLE_OPEN, Char.SLASH, lastNode.tagName].join(""),
                    parentTagName: lastNode.tagName,
                });
                return;
            }
        }
        this.currentNode = new HtmlNode();
    };
    buildTree = () => {
        let parentElement = this.tree;
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            node.parent = parentElement;
            if (node.isText()) {
                parentElement.childrens.push(node);
                continue;
            }
            if (node.isElement()) {
                if (node.isCloseTag) {
                    if (node.tagName === parentElement.tagName && parentElement.parent) {
                        parentElement = parentElement.parent;
                    }
                    else {
                        console.error([
                            `${node.pos.start.line - 1}: ${this.code.lines[node.pos.start.line - 2]}`,
                            `${node.pos.start.line}: ${this.code.lines[node.pos.start.line - 1]}`,
                            [
                                " ".repeat(node.pos.start.line.toString().length +
                                    node.pos.start.col +
                                    1),
                                "^".repeat(node.pos.end.col - node.pos.start.col + 1),
                                `(`,
                                [node.pos.start.col, node.pos.end.col].join("-"),
                                `)`,
                            ].join(""),
                        ].join("\n"));
                        throw new Error(`Close tag isnt valid`);
                    }
                }
                else {
                    parentElement.childrens.push(node);
                    if (!node.selfClosed) {
                        parentElement = node;
                    }
                }
            }
        }
        if (this.tree.childrens.length > 1) {
            throw new Error("Need root container");
        }
    };
    buildHtml = () => {
        return this.tree.toString();
    };
}
export { HtmlParser };
