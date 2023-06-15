import { logger as log } from "../logger.js";
import { Char } from "../const.js";
import { CharToGroup } from "./const.js";
import { Container } from "./container.js";
import { Group } from "./group.js";
import { Text } from "./text.js";
export class Parser {
    raw;
    config;
    tree = new Container(null);
    nodes = [this.tree];
    head = this.tree;
    i = 0;
    constructor(raw, config) {
        this.raw = raw;
        this.config = config;
        this.parse();
    }
    isRoot(target) {
        return !target.parent;
    }
    isText(target) {
        return target instanceof Text;
    }
    isGroup(target) {
        return target instanceof Group;
    }
    isContainer(target) {
        return target instanceof Container;
    }
    get prevChar() {
        return this.raw[this.i - 1];
    }
    get char() {
        return this.raw[this.i];
    }
    closeGroup(group) {
        group.closed = true;
        this.shiftIterator(group.closeChars);
        this.head = group.parent;
    }
    closeGroupHandler() {
        const groups = this.getGroupNameMatchs(CharToGroup.close);
        if (!groups.length)
            return false;
        const parent = this.isText(this.head) ? this.head.parent : this.head;
        // log.info("closeGroupHandler", this.char, groups, parent);
        if (this.isGroup(parent) && groups.matchs[parent.groupName]) {
            this.closeGroup(parent);
            return true;
        }
        return false;
    }
    shiftIterator(group) {
        this.i += group.length - 1;
    }
    getGroupNameMatchs(list) {
        let i = this.i;
        let char = this.char;
        const withEscape = this.prevChar === Char.SLACH_BACK;
        const result = {
            matchs: {},
            length: 0,
        };
        if (withEscape) {
            return result;
        }
        while (list && list[char]) {
            const groupName = list[char].groupName;
            if (groupName) {
                result.matchs[groupName] = true;
                result.longest =
                    groupName.length > (result.longest || "").length
                        ? groupName
                        : result.longest;
                result.length++;
            }
            list = list[char].inner;
            char = this.raw[++i];
        }
        return result;
    }
    openGroup(groupName) {
        const parent = this.isText(this.head) ? this.head.parent : this.head;
        if (!this.isContainer(parent))
            return;
        const groupConfig = this.config.groups[groupName];
        const group = new Group(parent, groupName, groupConfig);
        parent.childrens.push(group);
        group.parent = parent;
        this.shiftIterator(group.openChars);
        this.head = group;
        this.nodes.push(group);
    }
    openGroupHandler() {
        const groups = this.getGroupNameMatchs(CharToGroup.open);
        if (!groups.longest)
            return false;
        const parent = this.isText(this.head) ? this.head.parent : this.head;
        if (this.isGroup(parent)) {
            if (parent.includes(groups.longest)) {
                this.openGroup(groups.longest);
                return true;
            }
            else {
                return false;
            }
        }
        if (this.isRoot(parent)) {
            if (this.config.root[groups.longest]) {
                this.openGroup(groups.longest);
                return true;
            }
        }
        return false;
    }
    textHandler() {
        if (this.isContainer(this.head)) {
            const parent = this.head;
            const text = new Text(parent);
            parent.childrens.push(text);
            this.nodes.push(text);
            this.head = text;
        }
        if (this.isText(this.head)) {
            this.head.addChar(this.char);
        }
    }
    listHandler() {
        if (this.isGroup(this.head)) {
            log.info(this.head.groupName, this.char);
        }
        return false;
    }
    parse() {
        for (this.i = 0; this.i < this.raw.length; this.i++) {
            if (this.closeGroupHandler())
                continue;
            if (this.openGroupHandler())
                continue;
            if (this.listHandler())
                continue;
            this.textHandler();
        }
    }
}
//# sourceMappingURL=index.js.map