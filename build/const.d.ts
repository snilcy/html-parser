import { ICharGroups, ICharGroupToCharMap } from "./types.js";
export declare enum NodeType {
    EMPTY = "EMPTY",
    ELEMENT = "ELEMENT",
    TEXT = "TEXT"
}
export declare enum ElementPlace {
    EMPTY = "EMPTY",
    TAG_NAME = "TAG_NAME",
    ATTR_NAME = "ATTR_NAME",
    ATTR_VALUE = "ATTR_VALUE"
}
export declare const Char: {
    NEW_LINE: string;
    SLASH: string;
    SLACH_BACK: string;
    EQUALS: string;
    QUOTE_SINGLE: string;
    QUOTE_DOUBLE: string;
    QUOTE_BACKTICK: string;
    BRACKET_ANGLE_OPEN: string;
    BRACKET_ANGLE_CLOSE: string;
    BRACKET_ROUND_OPEN: string;
    BRACKET_ROUND_CLOSE: string;
    BRACKET_SQUARE_OPEN: string;
    BRACKET_SQUARE_CLOSE: string;
    BRACKET_CURLY_OPEN: string;
    BRACKET_CURLY_CLOSE: string;
    BRACKET_CURLY_OPEN_DOUBLE: string;
    BRACKET_CURLY_CLOSE_DOUBLE: string;
};
export declare const RawContentTags: string[];
export declare const StringStartChars: string[];
export declare const CharGroups: ICharGroups;
export declare const StartChartToGroup: ICharGroupToCharMap;
export declare const CharGroupChildrens: Map<any, any>;
export declare const TagToWrappers: {
    [keyof: string]: string[];
};
