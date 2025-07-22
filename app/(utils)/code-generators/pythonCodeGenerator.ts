import { DataType } from "../dataType";
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
                case "START" : { 
                    code += this.initializeVariables();
                    code += this.generateCode(node.getNextNode()); 
                    return code;
                }
                case "PRINT": {
                    let printNode = (node as CFPrintNode);

                    if(printNode.getMessage() instanceof CFVariableNode) {
                        code += "print(" + (printNode.getMessage() as CFVariableNode).getVarName() + ");\n";
                    } else {
                        code += "print(\"" + (printNode.getMessage() as string) + "\");\n";
                    }
                    break;
                }
                case "VARIABLE": {
                    let variableNode = (node as CFVariableNode);
                    code += variableNode.getVarName() + " = " + variableNode.getVarValue() + ";";
                }
            }
            node = node?.getNextNode();
        }
        
        return code;
    }
    initializeVariables(): string {
        let code = "";
        this.variables.entries().forEach((entry) => {
            switch(entry[1].getVarType()) {
                case DataType.Character: code += entry[1].getVarName() + " = '" + entry[1].getInitialVarValue() + "'";break;
                case DataType.String: code += entry[1].getVarName() + " = \"" + entry[1].getInitialVarValue() + "\"";break;
                case DataType.Integer: code += entry[1].getVarName() + " = " + entry[1].getInitialVarValue(); break;
                case DataType.Decimal: code += entry[1].getVarName() + " = " + entry[1].getInitialVarValue(); break;
                case DataType.Boolean: code += entry[1].getVarName() + " = " + entry[1].getInitialVarValue(); break;
                default: code += entry[1].getInitialVarValue();
            }
            code += ";\n"
        })
        return code;
    }
}