export interface ICodePosition {
    line: number;
    col: number;
}
export interface ICodeRange {
    start: ICodePosition;
    end: ICodePosition;
}
export interface IGroup {
    char: string;
    content: string;
}
export interface IListAttr {
    name: string;
    value: string;
}
export interface IObjAttr {
    [keyof: string]: string;
}
export type ICharGroup = [string, string];
export interface ICharGroups {
    [keyof: string]: ICharGroup;
}
export interface ICharGroupToCharMap {
    [keyof: string]: {
        [keyof: string]: ICharGroup;
    };
}
