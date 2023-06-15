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

export interface ICharGroupUsageList {
  [groupName: ICharGroupName]: true;
}

export interface IListConfig {
  [char: string]: boolean | IListConfig;
}

export interface ICharGroupItemConfig {
  includes?: ICharGroupUsageList;
  list?: IListConfig;
}

export interface ICharGroupConfig {
  groups: {
    [groupName: ICharGroupName]: ICharGroupItemConfig;
  };
  root: ICharGroupUsageList;
}

export interface ICharGroupMatch {
  matchs: ICharGroupUsageList;
  longest?: ICharGroupName;
  length: number;
}
