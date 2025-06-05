import { CFPrintNode, CFStartNode } from "../nodes";

export abstract class Parser {
    private readonly startingNode: CFStartNode;

    constructor(startingNode:CFStartNode) {
        this.startingNode = startingNode;
    }

    abstract parse() :string;
    abstract generateStartCode(node: CFStartNode):string;
    abstract generatePrintCode(node: CFPrintNode):string;
    getStartingNode():CFStartNode {
        return this.startingNode;
    }
}
