import { CFNode, CFPrintNode, CFStartNode, CFVariableNode } from "../nodes";
import { CodeGenerator } from "./codeGenerator";

export class JavaCodeGenerator extends CodeGenerator {
    constructor(private readonly variables:Map<string, CFVariableNode>) {
        super();
        this.variables = variables;
    }
    generateCode(node: CFNode|null): string {
        let code = "";

        while(node != null) {
            switch(node.getName()) {
                case "START" : 
                    code += "class " + (node as CFStartNode).getFileName() + " {\n\tpublic static void main(String []args) {\n\t\t";
                    code += this.initializeVariables();
                    code += this.generateCode(node.getNextNode()) 
                    code += "\t}\n}";
                    return code;
                case "PRINT": {
                    let printNode = (node as CFPrintNode);

                    if(printNode.getMessage() instanceof CFVariableNode) {
                        code += "System.out.println(" + (printNode.getMessage() as CFVariableNode).getVarName() + ");\n";
                    } else {
                        code += "System.out.println(\"" + (printNode.getMessage() as string) + "\");\n";
                    }
                    
                    break;
                }
            }
            node = node?.getNextNode();
        }
        
        return code;
    }
    initializeVariables(): string {
        let code = "";
        this.variables.entries().forEach((entry) => {
            if(entry[1].getVarType() == "string") {
                code += "String "
            } else {
                code += entry[1].getVarType() + " ";
            }
            code += entry[1].getVarName() + " = ";

            switch(entry[1].getVarType()) {
                case "char": code += "'" + entry[1].getVarValue() + "'";break;
                case "string": code += "\"" + entry[1].getVarValue() + "\"";break;
                case "boolean": code += entry[1].getVarValue().toLowerCase();break;
                case "float": code += entry[1].getVarValue() + "f";break;
                default: code += entry[1].getVarValue();
            }
            code += ";\n"
        })
        return code;
    }
}