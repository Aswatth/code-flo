import { DataType } from "../dataType";
import {
  CFNode,
  CFOperationNode,
  CFPrintNode,
  CFSetVariableNode,
  CFStartNode,
  CFVariableNode,
} from "../nodes";
import { CodeGenerator } from "./codeGenerator";

export class JavaCodeGenerator extends CodeGenerator {
  constructor(private readonly variables: Map<string, CFVariableNode>) {
    super();
    this.variables = variables;
  }
  generateCode(node: CFNode | null, indentationLevel: number): string {
    let code = "";

    while (node != null) {
      let indentation = "\t".repeat(indentationLevel);
      const nodeName = node.getName();
      switch (nodeName) {
        case "START": {
          code +=
            "class " +
            (node as CFStartNode).getFileName() +
            ` {\n${indentation}public static void main(String []args) {\n`;
          code += this.initializeVariables(indentationLevel + 1);
          code += this.generateCode(node.getNextNode(), indentationLevel + 1);
          code += `${indentation}}\n}`;
          return code;
        }
        case "PRINT": {
          let printNode = node as CFPrintNode;
          if (printNode.getMessage() instanceof CFOperationNode) {
            code +=
              indentation +
              "System.out.println(" +
              this.generateCode(
                printNode.getMessage() as CFOperationNode,
                indentationLevel
              ) +
              ");\n";
          } else if (printNode.getMessage() instanceof CFVariableNode) {
            code +=
              indentation +
              "System.out.println(" +
              (printNode.getMessage() as CFVariableNode).getVarName() +
              ");\n";
          } else {
            code +=
              indentation +
              'System.out.println("' +
              (printNode.getMessage() as string) +
              '");\n';
          }
          break;
        }
        case "SET-VARIABLE": {
          let variableNode = node as CFSetVariableNode;
          code += indentation + variableNode.getVarName() + " = ";

          if (variableNode.getVarValue() instanceof CFVariableNode) {
            code += (variableNode.getVarValue() as CFVariableNode).getVarName();
          } else if (variableNode.getVarValue() instanceof CFOperationNode) {
            code += this.generateCode(
              variableNode.getVarValue() as CFOperationNode,
              indentationLevel
            );
          } else {
            switch (variableNode.getVarType()) {
              case DataType.Character:
                code += "'" + (variableNode.getVarValue() as string) + "'";
                break;
              case DataType.String:
                code += '"' + (variableNode.getVarValue() as string) + '"';
                break;
              case DataType.Decimal:
                code += (variableNode.getVarValue() as string) + "f";
                break;
              default:
                code += (variableNode.getVarValue() as string).toLowerCase();
                break;
            }
          }

          code += ";\n";
          break;
        }
        case "OPERATION": {
          const operationNode = node as CFOperationNode;
          const operands = operationNode.getOperands();
          const lastOperand = operands[operands.length - 1];

          code += "(";
          for (let i = 0; i < operands.length - 1; ++i) {
            if (operands[i] instanceof CFVariableNode) {
              code += (operands[i] as CFVariableNode).getVarName();
            } else if (operands[i] instanceof CFOperationNode) {
              code += this.generateCode(
                operands[i] as CFOperationNode,
                indentationLevel
              );
            } else {
              code += operands[i] as string;
            }
            code += operationNode.getOperator();
          }
          if (lastOperand instanceof CFVariableNode) {
            code += lastOperand.getVarName();
          } else if (lastOperand instanceof CFOperationNode) {
            code += this.generateCode(lastOperand, indentationLevel);
          } else {
            code += lastOperand;
          }
          code += ")";
          break;
        }
      }
      node = node?.getNextNode();
    }

    return code;
  }
  initializeVariables(indentationLevel: number): string {
    let code = "";
    this.variables.entries().forEach((entry) => {
      code += `${"\t".repeat(indentationLevel)}`;
      switch (entry[1].getVarType()) {
        case DataType.Character:
          code +=
            "char " +
            entry[1].getVarName() +
            " = '" +
            entry[1].getInitialVarValue() +
            "'";
          break;
        case DataType.String:
          code +=
            "String " +
            entry[1].getVarName() +
            ' = "' +
            entry[1].getInitialVarValue() +
            '"';
          break;
        case DataType.Integer:
          code +=
            "int " +
            entry[1].getVarName() +
            " = " +
            entry[1].getInitialVarValue();
          break;
        case DataType.Decimal:
          code +=
            "float " +
            entry[1].getVarName() +
            " = " +
            entry[1].getInitialVarValue() +
            "f";
          break;
        case DataType.Boolean:
          code +=
            "boolean " +
            entry[1].getVarName() +
            " = " +
            entry[1].getInitialVarValue().toLowerCase();
          break;
        default:
          code += entry[1].getInitialVarValue();
      }
      code += ";\n";
    });
    return code;
  }
}
