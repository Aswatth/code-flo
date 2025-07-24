import { CFNode } from "../nodes";

export abstract class CodeGenerator {
    abstract generateCode(node: CFNode|null, indentationLevel:number) :string;
    abstract initializeVariables(indentationLevel:number): string;
}
