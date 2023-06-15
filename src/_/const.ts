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

export const RawContentTags = ["script", "style", "pre"];

export const StringStartChars = [
  // Char.QUOTE_SINGLE,
  // Char.QUOTE_DOUBLE,
  // Char.QUOTE_BACKTICK,
];

export const TagToWrappers: {
  [keyof: string]: string[];
} = {
  // script: [Char.QUOTE_SINGLE, Char.QUOTE_DOUBLE, Char.QUOTE_BACKTICK],
  // style: [Char.QUOTE_SINGLE, Char.QUOTE_DOUBLE],
};
