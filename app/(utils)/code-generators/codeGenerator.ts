import { CFNode, CFOperationNode, CFPrintNode, CFSetVariableNode } from "../nodes";

export abstract class CodeGenerator {
    abstract generatePrintStatement(printNode:CFPrintNode, indentationLevel:number):string;
    abstract generateSetVariableStatement(variableNode:CFSetVariableNode, indentationLevel:number):string;
    abstract generateOperationStatement(operationNode:CFOperationNode, indentationLevel:number):string;
    abstract generateCode(node: CFNode|null, indentationLevel:number) :string;
    abstract initializeVariables(indentationLevel:number): string;
}
