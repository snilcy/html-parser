import { ICodePosition } from "./types.js";
declare class Code {
    lines: string[];
    private addToLastLine;
    get col(): number;
    get line(): number;
    get pos(): ICodePosition;
    addChar: (char: string) => void;
    newLine: () => void;
}
export { Code };
