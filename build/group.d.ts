import { ICharGroup } from "./types.js";
declare class Group {
    content: string;
    childrens: Group[];
    parent: Group | null;
    chars: ICharGroup;
    closed: boolean;
    private childrenGroups;
    constructor(chars?: ICharGroup);
    get isEmpty(): boolean;
    private get openChar();
    private get closeChar();
    inChildren(char: string): string;
    addChar(char: string): Group | undefined;
}
export declare class GroupBuilder {
    tree: Group;
    raw: string;
    private head;
    constructor(raw: string);
    private getCharGroup;
    private parse;
}
export {};
