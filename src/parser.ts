import { logger } from "./logger.js";
import { Char, CharGroups, CharToGroup } from "./const.js";
import {
  ICharGroup,
  ICharGroupName,
  ICharGroupUsageList,
  ICharGroupConfig,
  ICharToGroupSection,
  ICharGroupMatch,
} from "./types.js";

const log = logger.ns("GroupBuiler");

class Node {
  public id: number;

  constructor(public parent: Container) {
    this.id = Node.lastId++;
  }

  public isRoot() {
    return !this.parent;
  }

  public isText(): this is Text {
    return this instanceof Text;
  }

  public isGroup(): this is Group {
    return this instanceof Group;
  }

  public isContainer(): this is Container {
    return this instanceof Container;
  }

  static lastId = 0;
}

class Text extends Node {
  public content = "";

  public addChar(char: string) {
    // log.info("addChar", char, this.char);
    this.content += char;
  }
}

class Container extends Node {
  childrens: Node[] = [];
}

class Group extends Container {
  public chars: ICharGroup;
  public groupName: ICharGroupName;
  public closed = false;
  public includes: ICharGroupUsageList;

  constructor(
    parent: Container,
    groupName: ICharGroupName,
    includes: ICharGroupUsageList = {}
  ) {
    super(parent);
    this.groupName = groupName;
    this.includes = includes;
    this.chars = CharGroups[groupName];
  }

  public get openChars() {
    return this.chars[0];
  }

  public get closeChars() {
    return this.chars[1];
  }

  public isCharsGroup(): this is Group {
    return Boolean(this.groupName);
  }
}

export class Parser {
  public tree = new Container(null as unknown as Container);
  public raw = "";
  public config: ICharGroupConfig;
  public nodes: Node[] = [this.tree];

  private head: Node = this.tree;
  private i = 0;

  constructor(raw: string, config: ICharGroupConfig) {
    this.raw = raw;
    this.config = config;
    this.parse();
    // log.debug("StartChartToGroup", StartChartToGroup);
    // log.debug("config", config);
  }

  private get prevChar() {
    return this.raw[this.i - 1];
  }

  private get char() {
    return this.raw[this.i];
  }

  private openGroup(groupName: ICharGroupName) {
    const parent = this.head.isText() ? this.head.parent : this.head;

    if (!parent.isContainer()) return;

    const group = new Group(parent, groupName, this.config.groups[groupName]);
    this.shiftIterator(group.openChars);

    parent.childrens.push(group);
    group.parent = parent;

    this.head = group;
    this.nodes.push(group);
  }

  private closeGroup(group: Group) {
    // const node = new Node(group.parent);

    group.closed = true;
    this.shiftIterator(group.closeChars);
    // group.parent.childrens.push(node);

    this.head = group.parent;
  }

  private closeGroupHandler(): boolean {
    const groups = this.getGroupNameMatchs(CharToGroup.close);
    if (!groups.length) return false;

    const parent = this.head.isText() ? this.head.parent : this.head;

    // log.info("closeGroupHandler", this.char, groups, parent);
    if (parent.isGroup() && groups.matchs[parent.groupName]) {
      this.closeGroup(parent);
      return true;
    }

    return false;
  }

  private shiftIterator(group: string) {
    this.i += group.length - 1;
  }

  private getGroupNameMatchs(list?: ICharToGroupSection) {
    let i = this.i;
    let char = this.char;
    const withEscape = this.prevChar === Char.SLACH_BACK;

    const result: ICharGroupMatch = {
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

  private openGroupHandler(): boolean {
    const groups = this.getGroupNameMatchs(CharToGroup.open);

    if (!groups.longest) return false;

    const parent = this.head.isText() ? this.head.parent : this.head;

    if (parent.isGroup()) {
      if (parent.includes[groups.longest]) {
        this.openGroup(groups.longest);
        return true;
      } else {
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

  private textHandler(): boolean {
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

  private parse() {
    for (this.i = 0; this.i < this.raw.length; this.i++) {
      if (this.closeGroupHandler()) continue;
      if (this.openGroupHandler()) continue;
      if (this.textHandler()) continue;
    }
  }
}
