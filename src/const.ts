import { ICharGroups, ICharGroup, ICharGroupToCharMap } from "./types.js";

export enum NodeType {
  EMPTY = "EMPTY",
  ELEMENT = "ELEMENT",
  TEXT = "TEXT",
}

export enum ElementPlace {
  EMPTY = "EMPTY",
  TAG_NAME = "TAG_NAME",
  ATTR_NAME = "ATTR_NAME",
  ATTR_VALUE = "ATTR_VALUE",
}

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

export const CharGroups: ICharGroups = {
  EMPTY: ["", ""],
  QUOTE_SINGLE: [Char.QUOTE_SINGLE, Char.QUOTE_SINGLE],
  QUOTE_DOUBLE: [Char.QUOTE_DOUBLE, Char.QUOTE_DOUBLE],
  QUOTE_BACKTICK: [Char.QUOTE_BACKTICK, Char.QUOTE_BACKTICK],
  BRACKET_ROUND: [Char.BRACKET_ROUND_OPEN, Char.BRACKET_ROUND_CLOSE],
  BRACKET_SQUARE: [Char.BRACKET_SQUARE_OPEN, Char.BRACKET_SQUARE_CLOSE],
  BRACKET_CURLY: [Char.BRACKET_CURLY_OPEN, Char.BRACKET_CURLY_CLOSE],
  BRACKET_CURLY_DOUBLE: [
    Char.BRACKET_CURLY_OPEN_DOUBLE,
    Char.BRACKET_CURLY_CLOSE_DOUBLE,
  ],
  BRACKET_ANGLE: [Char.BRACKET_ANGLE_OPEN, Char.BRACKET_ANGLE_CLOSE],
};

export const StartChartToGroup = Object.entries(CharGroups).reduce(
  (result: ICharGroupToCharMap, [_, groupChars]) => {
    const startChar = groupChars[0];
    const lenKey = startChar.length.toString();
    const lenGroup = result[lenKey] || {};
    lenGroup[startChar] = groupChars;
    result[lenKey] = lenGroup;
    return result;
  },
  {}
);

export const CharGroupChildrens = new Map();
CharGroupChildrens.set(CharGroups.EMPTY, Object.values(CharGroups));
CharGroupChildrens.set(CharGroups.BRACKET_ANGLE, [
  CharGroups.QUOTE_SINGLE,
  CharGroups.QUOTE_DOUBLE,
]);

export const TagToWrappers: {
  [keyof: string]: string[];
} = {
  script: [Char.QUOTE_SINGLE, Char.QUOTE_DOUBLE, Char.QUOTE_BACKTICK],
  style: [Char.QUOTE_SINGLE, Char.QUOTE_DOUBLE],
};
