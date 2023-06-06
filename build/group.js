import { logger } from "./logger.js";
import { CharGroups, CharToGroup } from "./const.js";
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
        this.content += char;
    }
    print() {
        return this.content;
    }
}
class Container extends Node {
    childrens = [];
    print() {
        return this.childrens.map((children) => children.print());
    }
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
    get char() {
        return this.raw[this.i];
    }
    openGroup(groupName) {
        const parent = this.head.isText() ? this.head.parent : this.head;
        if (!parent.isContainer())
            return;
        const group = new Group(parent, groupName, this.config.groups[groupName]);
        parent.childrens.push(group);
        group.parent = parent;
        this.head = group;
        this.nodes.push(group);
    }
    closeGroup(group) {
        // const node = new Node(group.parent);
        group.closed = true;
        // group.parent.childrens.push(node);
        this.head = group.parent;
    }
    closeGroupHandler() {
        const { groupName, inner } = CharToGroup.close[this.char] || {};
        if (!groupName)
            return false;
        const parent = this.head.isText() ? this.head.parent : this.head;
        // log.info("closeGroupHandler", this.char, groupName, parent);
        if (parent.isGroup() && parent.groupName === groupName) {
            this.closeGroup(parent);
            return true;
        }
        return false;
    }
    openGroupHandler() {
        const { groupName, inner } = CharToGroup.open[this.char] || {};
        if (!groupName)
            return false;
        const parent = this.head.isText() ? this.head.parent : this.head;
        if (parent.isGroup()) {
            if (!parent.includes[groupName]) {
                return false;
            }
        }
        if (this.head.isText() || this.head.isRoot()) {
            this.openGroup(groupName);
            return true;
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
        for (let i = 0; i < this.raw.length; i++) {
            this.i = i;
            if (this.closeGroupHandler())
                continue;
            const open = this.openGroupHandler();
            if (open)
                continue;
            if (this.textHandler())
                continue;
        }
    }
}
