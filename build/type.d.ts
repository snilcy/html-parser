interface IPosition {
    line: number;
    col: number;
}
interface IRange {
    start: IPosition;
    end: IPosition;
}
interface IGroup {
    char: string;
    content: string;
}
interface IListAttr {
    name: string;
    value: string;
}
interface IObjAttr {
    [keyof: string]: string;
}
export { IPosition, IRange, IGroup, IObjAttr, IListAttr };
