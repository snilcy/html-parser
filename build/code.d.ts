import { IPosition } from "./type.js";
declare class Code {
    lines: string[];
    private addToLastLine;
    get col(): number;
    get line(): number;
    get pos(): IPosition;
    addChar: (char: string) => void;
    newLine: () => void;
}
export { Code };
