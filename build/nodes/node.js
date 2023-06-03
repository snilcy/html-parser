import { last, lastIndex, updateById } from "@snilcy/cake";
import { Char, NodeType } from "../const.js";
class HtmlNode {
    static lastId = 0;
    id;
    groups = [];
    inGroup = false;
    content = "";
    // eslint-disable-next-line no-use-before-define
    parent = null;
    pos = {
        start: { line: 0, col: 0 },
        end: { line: 0, col: 0 },
    };
    groupChars = [];
    type;
    needCloseGroup = false;
    constructor(startPos = { col: 0, line: 0 }, type = NodeType.EMPTY) {
        this.id = HtmlNode.lastId++;
        this.pos.start = startPos;
        this.type = type;
    }
    isElement() {
        return this.type === NodeType.ELEMENT;
    }
    isText() {
        return this.type === NodeType.TEXT;
    }
    get isRoot() {
        return this.id === 0;
    }
    get isNode() {
        return this.type === NodeType.EMPTY;
    }
    get isGroupStarted() {
        const group = this.lastGroup;
        return Boolean(group.char && !group.content.length);
    }
    get isGroupEnded() {
        return this.needCloseGroup;
    }
    addChar(char) {
        const lastGroup = this.lastGroup;
        this.content += char;
        if (this.needCloseGroup) {
            return this.needCloseGroupHandler();
        }
        if (this.inGroup &&
            char === lastGroup.char &&
            lastGroup.content[lastGroup.content.length - 2] !== Char.SLACH_BACK) {
            return this.closeGroupHandler();
        }
        if (!this.inGroup && this.groupChars.includes(char)) {
            return this.newGroupHandler(char);
        }
        if (this.inGroup) {
            return this.updateGroupHandler(char);
        }
    }
    get lastGroup() {
        return last(this.groups) || {};
    }
    needCloseGroupHandler = () => {
        this.needCloseGroup = false;
    };
    closeGroupHandler = () => {
        this.needCloseGroup = true;
        this.inGroup = false;
    };
    newGroupHandler = (char) => {
        this.inGroup = true;
        this.groups.push({
            char,
            content: "",
        });
    };
    updateGroupHandler = (char) => {
        updateById(this.groups, lastIndex(this.groups), (group) => ({
            ...group,
            content: group.content + char,
        }));
    };
}
export { HtmlNode };
