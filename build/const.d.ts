declare enum NodeType {
    EMPTY = "empty",
    ELEMENT = "element",
    TEXT = "text"
}
declare enum ElementPlace {
    EMPTY = "empty",
    TAG_NAME = "tag-name",
    ATTR_NAME = "attr-name",
    ATTR_VALUE = "attr-value"
}
declare const Char: {
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
};
declare const RawContentTags: string[];
declare const StringStartChars: string[];
declare const Wrapper: {
    [x: string]: string;
};
declare const TagToWrappers: {
    [keyof: string]: string[];
};
export { NodeType, ElementPlace, Char, RawContentTags, StringStartChars, Wrapper, TagToWrappers, };
