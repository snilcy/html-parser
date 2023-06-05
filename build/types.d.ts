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
export type ICharGroupName = string;
export type ICharGroup = [string, string];
export interface ICharGroups {
    [groupName: ICharGroupName]: ICharGroup;
}
export interface ICharToGroupSection {
    [char: string]: {
        groupName?: ICharGroupName;
        inner?: ICharToGroupSection;
    };
}
export interface ICharToGroup {
    open: ICharToGroupSection;
    close: ICharToGroupSection;
}
export interface ICharGroupsStartMap {
    [groupName: ICharGroupName]: ICharGroup;
}
export interface IGroupUsageList {
    [groupName: ICharGroupName]: true;
}
export interface IGroupsConfig {
    groups: {
        [groupName: ICharGroupName]: IGroupUsageList;
    };
    root: IGroupUsageList;
}
