import { logger } from "./logger.js";
import { Char, CharGroups, CharToGroup } from "./const.js";
const log = logger.ns("GroupBuiler");
class Node {
    parent;
    id;
    constructor(parent) {
        this.parent = parent;
        this.id = Node.lastId++;
    }
    isRoot() {
        return !this.parent;
    }
    isText() {
        return this instanceof Text;
    }
    isGroup() {
        return this instanceof Group;
    }
    isContainer() {
        return this instanceof Container;
    }
    static lastId = 0;
}
class Text extends Node {
    content = "";
    addChar(char) {
        // log.info("addChar", char, this.char);
        this.content += char;
    }
}
class Container extends Node {
    childrens = [];
}
class Group extends Container {
    chars;
    groupName;
    closed = false;
    includes;
    constructor(parent, groupName, includes = {}) {
        super(parent);
        this.groupName = groupName;
        this.includes = includes;
        this.chars = CharGroups[groupName];
    }
    get openChars() {
        return this.chars[0];
    }
    get closeChars() {
        return this.chars[1];
    }
    isCharsGroup() {
        return Boolean(this.groupName);
    }
}
export class Parser {
    tree = new Container(null);
    raw = "";
    config;
    nodes = [this.tree];
    head = this.tree;
    i = 0;
    constructor(raw, config) {
        this.raw = raw;
        this.config = config;
        this.parse();
        // log.debug("StartChartToGroup", StartChartToGroup);
        // log.debug("config", config);
    }
    get prevChar() {
        return this.raw[this.i - 1];
    }
    get char() {
        return this.raw[this.i];
    }
    openGroup(groupName) {
        const parent = this.head.isText() ? this.head.parent : this.head;
        if (!parent.isContainer())
            return;
        const group = new Group(parent, groupName, this.config.groups[groupName]);
        this.shiftIterator(group.openChars);
        parent.childrens.push(group);
        group.parent = parent;
        this.head = group;
        this.nodes.push(group);
    }
    closeGroup(group) {
        // const node = new Node(group.parent);
        group.closed = true;
        this.shiftIterator(group.closeChars);
        // group.parent.childrens.push(node);
        this.head = group.parent;
    }
    closeGroupHandler() {
        const groups = this.getGroupNameMatchs(CharToGroup.close);
        if (!groups.length)
            return false;
        const parent = this.head.isText() ? this.head.parent : this.head;
        // log.info("closeGroupHandler", this.char, groups, parent);
        if (parent.isGroup() && groups.matchs[parent.groupName]) {
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
    openGroupHandler() {
        const groups = this.getGroupNameMatchs(CharToGroup.open);
        if (!groups.longest)
            return false;
        const parent = this.head.isText() ? this.head.parent : this.head;
        if (parent.isGroup()) {
            if (parent.includes[groups.longest]) {
                this.openGroup(groups.longest);
                return true;
            }
            else {
                return false;
            }
        }
        if (parent.isRoot()) {
            if (this.config.root[groups.longest]) {
                this.openGroup(groups.longest);
                return true;
            }
        }
        return false;
    }
    textHandler() {
        if (!this.head.isText()) {
            const parent = this.head.isContainer() ? this.head : this.head.parent;
            const text = new Text(parent);
            parent.childrens.push(text);
            this.nodes.push(text);
            this.head = text;
        }
        if (this.head.isText()) {
            this.head.addChar(this.char);
        }
        return false;
    }
    parse() {
        for (this.i = 0; this.i < this.raw.length; this.i++) {
            if (this.closeGroupHandler())
                continue;
            if (this.openGroupHandler())
                continue;
            if (this.textHandler())
                continue;
        }
    }
}
