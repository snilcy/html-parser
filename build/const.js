export var NodeType;
(function (NodeType) {
    NodeType["EMPTY"] = "EMPTY";
    NodeType["ELEMENT"] = "ELEMENT";
    NodeType["TEXT"] = "TEXT";
})(NodeType || (NodeType = {}));
export var ElementPlace;
(function (ElementPlace) {
    ElementPlace["EMPTY"] = "EMPTY";
    ElementPlace["TAG_NAME"] = "TAG_NAME";
    ElementPlace["ATTR_NAME"] = "ATTR_NAME";
    ElementPlace["ATTR_VALUE"] = "ATTR_VALUE";
})(ElementPlace || (ElementPlace = {}));
export const Char = {
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
    BRACKET_CURLY_OPEN_DOUBLE: "{{",
    BRACKET_CURLY_CLOSE_DOUBLE: "}}",
};
export const RawContentTags = ["script", "style", "pre"];
export const StringStartChars = [
    Char.QUOTE_SINGLE,
    Char.QUOTE_DOUBLE,
    Char.QUOTE_BACKTICK,
];
export const CharGroupName = {
    TEXT: "t",
    QUOTE_SINGLE: Char.QUOTE_SINGLE,
    QUOTE_DOUBLE: Char.QUOTE_DOUBLE,
    QUOTE_BACKTICK: Char.QUOTE_BACKTICK,
    BRACKET_ROUND: Char.BRACKET_ROUND_OPEN + Char.BRACKET_ROUND_CLOSE,
    BRACKET_SQUARE: Char.BRACKET_SQUARE_OPEN + Char.BRACKET_SQUARE_CLOSE,
    BRACKET_CURLY: Char.BRACKET_CURLY_OPEN + Char.BRACKET_CURLY_CLOSE,
    BRACKET_CURLY_DOUBLE: Char.BRACKET_CURLY_OPEN_DOUBLE + Char.BRACKET_CURLY_CLOSE_DOUBLE,
    BRACKET_ANGLE: Char.BRACKET_ANGLE_OPEN + Char.BRACKET_ANGLE_CLOSE,
};
export const CharGroups = {
    // [CharGroupName.TEXT]: ["", ""],
    [CharGroupName.QUOTE_SINGLE]: [Char.QUOTE_SINGLE, Char.QUOTE_SINGLE],
    [CharGroupName.QUOTE_DOUBLE]: [Char.QUOTE_DOUBLE, Char.QUOTE_DOUBLE],
    [CharGroupName.QUOTE_BACKTICK]: [Char.QUOTE_BACKTICK, Char.QUOTE_BACKTICK],
    [CharGroupName.BRACKET_ROUND]: [
        Char.BRACKET_ROUND_OPEN,
        Char.BRACKET_ROUND_CLOSE,
    ],
    [CharGroupName.BRACKET_SQUARE]: [
        Char.BRACKET_SQUARE_OPEN,
        Char.BRACKET_SQUARE_CLOSE,
    ],
    [CharGroupName.BRACKET_CURLY]: [
        Char.BRACKET_CURLY_OPEN,
        Char.BRACKET_CURLY_CLOSE,
    ],
    [CharGroupName.BRACKET_CURLY_DOUBLE]: [
        Char.BRACKET_CURLY_OPEN_DOUBLE,
        Char.BRACKET_CURLY_CLOSE_DOUBLE,
    ],
    [CharGroupName.BRACKET_ANGLE]: [
        Char.BRACKET_ANGLE_OPEN,
        Char.BRACKET_ANGLE_CLOSE,
    ],
};
const reduceChars = (str, groupName, result) => [...str].reduce((resultPart, char, id) => {
    const isLastChar = id + 1 === str.length;
    const section = resultPart[char] || {};
    resultPart[char] = section;
    if (isLastChar) {
        section.groupName = groupName;
        return resultPart;
    }
    else {
        section.inner = section.inner || {};
        return section.inner;
    }
}, result);
export const CharToGroup = Object.entries(CharGroups).reduce((result, [groupName, [openChars, closeChars]]) => {
    reduceChars(openChars, groupName, result.open);
    reduceChars(closeChars, groupName, result.close);
    return result;
}, {
    open: {},
    close: {},
});
export const TagToWrappers = {
    script: [Char.QUOTE_SINGLE, Char.QUOTE_DOUBLE, Char.QUOTE_BACKTICK],
    style: [Char.QUOTE_SINGLE, Char.QUOTE_DOUBLE],
};
