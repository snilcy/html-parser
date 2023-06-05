import { logger } from "./logger.js";
import { CharGroupName, CharGroups, CharToGroup } from "./const.js";
import {
  ICharGroup,
  ICharGroupName,
  IGroupUsageList,
  IGroupsConfig,
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
  public includes: IGroupUsageList;

  constructor(
    parent: Container,
    groupName: ICharGroupName,
    includes: IGroupUsageList = {}
  ) {
    super(parent);
    this.groupName = groupName;
    this.includes = includes;
    this.chars = CharGroups[groupName];
  }

  private get openChars() {
    return this.chars[0];
  }

  private get closeChars() {
    return this.chars[1];
  }

  public isCharsGroup(): this is Group {
    return Boolean(this.groupName);
  }

  toString() {
    return [
      `${this.id}${this.openChars}`,
      // this.childrens.map((str) => `${"_".repeat(this.deep) + str}`).join(""),
      `${this.id}${this.closeChars}`,
    ].join("\n");
  }
}

export class GroupBuilder {
  public tree = new Container(null as unknown as Container);
  public raw = "";
  public config: IGroupsConfig;
  public nodes: Node[] = [this.tree];

  private head: Node = this.tree;
  private i = 0;

  constructor(raw: string, config: IGroupsConfig) {
    this.raw = raw;
    this.config = config;
    this.parse();
    // log.debug("StartChartToGroup", StartChartToGroup);
    // log.debug("config", config);
  }

  private get char() {
    return this.raw[this.i];
  }

  private openGroup(groupName: ICharGroupName) {
    const parent = this.head.isText() ? this.head.parent : this.head;

    if (!parent.isContainer()) return;

    const group = new Group(parent, groupName, this.config.groups[groupName]);

    parent.childrens.push(group);
    group.parent = parent;

    this.head = group;
    this.nodes.push(group);
  }

  private closeGroup(group: Group) {
    // const node = new Node(group.parent);

    group.closed = true;
    // group.parent.childrens.push(node);

    this.head = group.parent;
  }

  private closeGroupHandler(): boolean {
    const { groupName, inner } = CharToGroup.close[this.char] || {};
    if (!groupName) return false;

    const parent = this.head.isText() ? this.head.parent : this.head;

    log.info("closeGroupHandler", this.char, groupName, parent);
    if (parent.isGroup() && parent.groupName === groupName) {
      this.closeGroup(parent);
      return true;
    }

    return false;
  }

  private openGroupHandler(): boolean {
    const { groupName, inner } = CharToGroup.open[this.char] || {};
    if (!groupName) return false;

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
    for (let i = 0; i < this.raw.length; i++) {
      this.i = i;
      if (this.closeGroupHandler()) continue;

      const open = this.openGroupHandler();
      if (open) continue;
      if (this.textHandler()) continue;
    }
  }
}
