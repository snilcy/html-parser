enum NodeType {
  EMPTY = "empty",
  ELEMENT = "element",
  TEXT = "text",
}

enum ElementPlace {
  EMPTY = "empty",
  TAG_NAME = "tag-name",
  ATTR_NAME = "attr-name",
  ATTR_VALUE = "attr-value",
}

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

const TagToWrappers: {
  [keyof: string]: string[];
} = {
  script: [Char.QUOTE_SINGLE, Char.QUOTE_DOUBLE, Char.QUOTE_BACKTICK],
  style: [Char.QUOTE_SINGLE, Char.QUOTE_DOUBLE],
};

export {
  NodeType,
  ElementPlace,
  Char,
  RawContentTags,
  StringStartChars,
  Wrapper,
  TagToWrappers,
};
