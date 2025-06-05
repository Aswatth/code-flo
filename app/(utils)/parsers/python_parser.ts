import { CFNode, CFPrintNode, CFStartNode } from "../nodes";
import { Parser } from "./parser";

export class PythonParser extends Parser {
    constructor(private startNode:CFStartNode) {
        super(startNode);
    }

    parse():string {
        let node : CFNode | null | CFStartNode = this.getStartingNode();
        let code = "";

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
        return "%CODE%";
    }

    generatePrintCode(node:CFPrintNode): string {
        return "print(\"" + node.getMessage() + "\"); %CODE%";
    }
}