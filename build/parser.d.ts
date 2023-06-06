import { ICharGroup, ICharGroupName, IGroupUsageList, IGroupsConfig } from "./types.js";
declare class Node {
    parent: Container;
    id: number;
    constructor(parent: Container);
    isRoot(): boolean;
    isText(): this is Text;
    isGroup(): this is Group;
    isContainer(): this is Container;
    static lastId: number;
}
declare class Text extends Node {
    content: string;
    addChar(char: string): void;
}
declare class Container extends Node {
    childrens: Node[];
}
declare class Group extends Container {
    chars: ICharGroup;
    groupName: ICharGroupName;
    closed: boolean;
    includes: IGroupUsageList;
    constructor(parent: Container, groupName: ICharGroupName, includes?: IGroupUsageList);
    private get openChars();
    private get closeChars();
    isCharsGroup(): this is Group;
    toString(): string;
}
export declare class Parser {
    tree: Container;
    raw: string;
    config: IGroupsConfig;
    nodes: Node[];
    private head;
    private i;
    constructor(raw: string, config: IGroupsConfig);
    private get char();
    private openGroup;
    private closeGroup;
    private closeGroupHandler;
    private openGroupHandler;
    private textHandler;
    private parse;
}
export {};
