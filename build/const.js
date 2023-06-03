var NodeType;
(function (NodeType) {
    NodeType["EMPTY"] = "empty";
    NodeType["ELEMENT"] = "element";
    NodeType["TEXT"] = "text";
})(NodeType || (NodeType = {}));
var ElementPlace;
(function (ElementPlace) {
    ElementPlace["EMPTY"] = "empty";
    ElementPlace["TAG_NAME"] = "tag-name";
    ElementPlace["ATTR_NAME"] = "attr-name";
    ElementPlace["ATTR_VALUE"] = "attr-value";
})(ElementPlace || (ElementPlace = {}));
const Char = {
    NEW_LINE: "\n",
    SLASH: "/",
    SLACH_BACK: "\\",
    EQUALS: "=",
    QUOTE_SINGLE: "'",
    QUOTE_DOUBLE: '"',
    QUOTE_BACKTICK: "`",
    BRACKET_ANGLE_OPEN: "<",
    BRACKET_ANGLE_CLOSE: ">",
    BRACKET_ROUND_OPEN: "(",
    BRACKET_ROUND_CLOSE: ")",
    BRACKET_SQUARE_OPEN: "[",
    BRACKET_SQUARE_CLOSE: "]",
    BRACKET_CURLY_OPEN: "{",
    BRACKET_CURLY_CLOSE: "}",
};
const RawContentTags = ["script", "style", "pre"];
const StringStartChars = [
    Char.QUOTE_SINGLE,
    Char.QUOTE_DOUBLE,
    Char.QUOTE_BACKTICK,
];
const Wrapper = {
    [Char.QUOTE_SINGLE]: Char.QUOTE_SINGLE,
    [Char.QUOTE_DOUBLE]: Char.QUOTE_DOUBLE,
    [Char.QUOTE_BACKTICK]: Char.QUOTE_BACKTICK,
    [Char.BRACKET_ROUND_OPEN]: Char.BRACKET_ROUND_CLOSE,
    [Char.BRACKET_SQUARE_OPEN]: Char.BRACKET_SQUARE_CLOSE,
    [Char.BRACKET_CURLY_OPEN]: Char.BRACKET_CURLY_CLOSE,
    // [Char.BRACKET_ANGLE_OPEN]: Char.BRACKET_ANGLE_CLOSE,
};
const TagToWrappers = {
    script: [Char.QUOTE_SINGLE, Char.QUOTE_DOUBLE, Char.QUOTE_BACKTICK],
    style: [Char.QUOTE_SINGLE, Char.QUOTE_DOUBLE],
};
export { NodeType, ElementPlace, Char, RawContentTags, StringStartChars, Wrapper, TagToWrappers, };
