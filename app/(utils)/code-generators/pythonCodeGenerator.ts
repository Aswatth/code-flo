import { CFNode, CFPrintNode } from "../nodes";
import { CodeGenerator } from "./codeGenerator";

export class PythonCodeGenerator extends CodeGenerator {
    generateCode(node:CFNode|null):string {
        let code = "";

        while(node != null) {
            switch(node.getName()) {
                case "START" : 
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
}