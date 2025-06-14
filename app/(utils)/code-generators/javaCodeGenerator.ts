import { CFNode, CFPrintNode, CFStartNode } from "../nodes";
import { CodeGenerator } from "./codeGenerator";

export class JavaCodeGenerator extends CodeGenerator {
    generateCode(node: CFNode|null): string {
        let code = "";

        while(node != null) {
            switch(node.getName()) {
                case "START" : 
                    code += "class " + (node as CFStartNode).getFileName() + " {\n\tpublic static void main(String []args) {\n\t\t";
                    code += this.generateCode(node.getNextNode()) 
                    code += "\t}\n}";
                    return code;
                case "PRINT": 
                    code += "System.out.println(\"" + (node as CFPrintNode).getMessage() + "\");\n";
                    break;
            }
            node = node?.getNextNode();
        }
        
        return code;
    }
}