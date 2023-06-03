import { lastIndex, updateById } from "@snilcy/cake";
import { ElementPlace, Char, NodeType } from "../const.js";
import { HtmlNode } from "./node.js";
class HtmlElement extends HtmlNode {
    place = ElementPlace.TAG_NAME;
    closed = false;
    tagName = "";
    isCloseTag = false;
    selfClosed = false;
    childrens = [];
    attrsList = [];
    attrs = {};
    constructor(startPos) {
        super(startPos, NodeType.ELEMENT);
        this.groupChars = [Char.QUOTE_SINGLE, Char.QUOTE_DOUBLE];
        this.content = "<";
    }
    afterTagName = () => {
        this.place = ElementPlace.EMPTY;
    };
    updateLastAttr = (callback) => {
        updateById(this.attrsList, Math.max(lastIndex(this.attrsList), 0), ({ name = "", value = "" }) => callback(name, value));
    };
    close = () => {
        if (this.place === ElementPlace.TAG_NAME) {
            this.afterTagName();
        }
        this.attrs = this.attrsList.reduce((result, { name, value }) => {
            result[name] = value;
            return result;
        }, {});
        this.content += Char.BRACKET_ANGLE_CLOSE;
        this.place = ElementPlace.EMPTY;
        this.closed = true;
    };
    addChar = (char) => {
        if (this.closed) {
            return;
        }
        super.addChar(char);
        // log.info(char, this.inGroup);
        if (this.place === ElementPlace.ATTR_NAME) {
            // attr value
            if (char === Char.EQUALS) {
                this.place = ElementPlace.ATTR_VALUE;
                return;
            }
            // attr without value
            if (char.match(/\s/)) {
                this.place = ElementPlace.EMPTY;
                return;
            }
            this.updateLastAttr((name, value) => ({
                name: name + char,
                value,
            }));
            return;
        }
        if (this.place === ElementPlace.ATTR_VALUE) {
            if (this.isGroupStarted) {
                return;
            }
            if (this.isGroupEnded) {
                this.place = ElementPlace.EMPTY;
                return;
            }
            this.updateLastAttr((name, value) => ({
                name,
                value: value + char,
            }));
            return;
        }
        if (this.place === ElementPlace.TAG_NAME) {
            if (char === Char.SLASH) {
                this.isCloseTag = true;
                return;
            }
            if (char.match(/[\S]/)) {
                this.tagName += char;
            }
            else {
                this.afterTagName();
            }
            return;
        }
        if (char === Char.SLASH) {
            this.selfClosed = true;
            return;
        }
        if (char.match(/\S/)) {
            this.place = ElementPlace.ATTR_NAME;
            this.attrsList.push({
                name: char,
                value: "",
            });
        }
    };
    toString = () => {
        const attrs = Object.keys(this.attrs)
            .map((name) => `${name}="${this.attrs[name]}"`)
            .join(" ");
        const content = this.childrens.join("");
        if (this.isRoot)
            return content;
        if (this.selfClosed)
            return [
                Char.BRACKET_ANGLE_OPEN,
                [this.tagName, attrs, Char.SLASH + Char.BRACKET_ANGLE_CLOSE].join(" "),
            ].join("");
        return [
            Char.BRACKET_ANGLE_OPEN,
            [this.tagName, attrs].join(" "),
            Char.BRACKET_ANGLE_CLOSE,
            content,
            this.buildClose(),
        ].join("");
    };
    buildClose = () => {
        return [
            Char.BRACKET_ANGLE_OPEN,
            Char.SLASH,
            this.tagName,
            Char.BRACKET_ANGLE_CLOSE,
        ].join("");
    };
}
export { HtmlElement };
