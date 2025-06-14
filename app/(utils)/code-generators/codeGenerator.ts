import { CFNode } from "../nodes";

export abstract class CodeGenerator {
    abstract generateCode(node: CFNode|null) :string;
}
