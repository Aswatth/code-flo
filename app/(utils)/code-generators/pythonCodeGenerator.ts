import { CFNode, CFPrintNode, CFVariableNode } from "../nodes";
import { CodeGenerator } from "./codeGenerator";

export class PythonCodeGenerator extends CodeGenerator {
    constructor(private readonly variables:Map<string, CFVariableNode>) {
        super();
        this.variables = variables;
    }
    generateCode(node:CFNode|null):string {
        let code = "";

        while(node != null) {
            switch(node.getName()) {
                case "START" : 
                    code += this.initializeVariables();
                    code += this.generateCode(node.getNextNode()); 
                    return code;
                case "PRINT": 
                    code += "print(\"" + (node as CFPrintNode).getMessage() + "\")\n";
                    break;
            }
            node = node?.getNextNode();
        }
        
        return code;
    }
    initializeVariables(): string {
        let code = "";
        this.variables.entries().forEach((entry) => {
            code += entry[1].getVarName() + " = ";

            switch(entry[1].getVarType()) {
                case "char": code += "'" + entry[1].getVarValue() + "'";break;
                case "string": code += "\"" + entry[1].getVarValue() + "\"";break;
                default: code += entry[1].getVarValue();
            }
            code += ";\n"
        })
        return code;
    }
}