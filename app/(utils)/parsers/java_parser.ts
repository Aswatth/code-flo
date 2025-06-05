import { CFNode, CFPrintNode, CFStartNode } from "../nodes";
import { Parser } from "./parser";

export class JavaParser extends Parser {
    constructor(startNode:CFStartNode) {
        super(startNode);
    }

    parse():string {
        let node : CFNode | null | CFStartNode = this.getStartingNode();
        let code = "";

        console.log(node);

        while(node != null) {
            let generatedCode = "";
            switch(node.getName()) {
                case "START" : generatedCode = this.generateStartCode(( node as CFStartNode));break;
                case "PRINT": generatedCode = this.generatePrintCode((node as CFPrintNode));break;
            }
            if(code.includes("%CODE%")) {
                code = code.replace("%CODE%", generatedCode);
            } else {
                code = generatedCode;
            }
            node = node?.getNextNode();
        }
        code = code.replace("%CODE%", "");
        
        return code;
    }
    
    generateStartCode(node:CFStartNode): string {
        return "class " + node.getFileName() + " { public static void main(String []args) { %CODE% } }";
    }

    generatePrintCode(node:CFPrintNode): string {
        return "System.out.println(\"" + node.getMessage() + "\"); %CODE%";
    }
}