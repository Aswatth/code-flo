import { DataType } from "../dataType";
import {
  CFNode,
  CFOperationNode,
  CFPrintNode,
  CFStartNode,
  CFVariableNode,
} from "../nodes";
import { CodeGenerator } from "./codeGenerator";

export class JavaCodeGenerator extends CodeGenerator {
  constructor(private readonly variables: Map<string, CFVariableNode>) {
    super();
    this.variables = variables;
  }
  generateCode(node: CFNode | null): string {
    let code = "";

    while (node != null) {
      const nodeName = node.getName();
      switch (nodeName) {
        case "START": {
          code +=
            "class " +
            (node as CFStartNode).getFileName() +
            " {\n\tpublic static void main(String []args) {\n\t\t";
          code += this.initializeVariables();
          code += this.generateCode(node.getNextNode());
          code += "\t}\n}";
          return code;
        }
        case "PRINT": {
          let printNode = node as CFPrintNode;
          if (printNode.getMessage() instanceof CFOperationNode) {
            code +=
              "System.out.println(" +
              this.generateCode(printNode.getMessage() as CFOperationNode) +
              ");\n";
          } else if (printNode.getMessage() instanceof CFVariableNode) {
            code +=
              "System.out.println(" +
              (printNode.getMessage() as CFVariableNode).getVarName() +
              ");\n";
          } else {
            code +=
              'System.out.println("' +
              (printNode.getMessage() as string) +
              '");\n';
          }
          break;
        }
        case "VARIABLE": {
          let variableNode = node as CFVariableNode;
          code += variableNode.getVarName() + " = ";

          if (variableNode.getVarValue() instanceof CFVariableNode) {
            code += (variableNode.getVarValue() as CFVariableNode).getVarName();
          } else if (variableNode.getVarValue() instanceof CFOperationNode) {
            code += this.generateCode(
              variableNode.getVarValue() as CFOperationNode
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

          code += ";";
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
              code += this.generateCode(operands[i] as CFOperationNode);
            } else {
              code += operands[i];
            }
            code += operationNode.getOperator();
          }
          if (lastOperand instanceof CFVariableNode) {
            code += lastOperand.getVarName();
          } else if (lastOperand instanceof CFOperationNode) {
            code += this.generateCode(lastOperand);
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
  initializeVariables(): string {
    let code = "";
    this.variables.entries().forEach((entry) => {
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
