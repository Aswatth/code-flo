import { DataType } from "../dataType";
import { CFNode, CFOperationNode, CFPrintNode, CFVariableNode } from "../nodes";
import { CodeGenerator } from "./codeGenerator";

export class PythonCodeGenerator extends CodeGenerator {
  constructor(private readonly variables: Map<string, CFVariableNode>) {
    super();
    this.variables = variables;
  }
  generateCode(node: CFNode | null, indendatationLevel:number = 0): string {
    let code = "";

    while (node != null) {
      switch (node.getName()) {
        case "START": {
          code += this.initializeVariables(indendatationLevel);
          code += this.generateCode(node.getNextNode(), indendatationLevel + 1);
          return code;
        }
        case "PRINT": {
          let printNode = node as CFPrintNode;

          if (printNode.getMessage() instanceof CFOperationNode) {
            code +=
              "print(" +
              this.generateCode(printNode.getMessage() as CFOperationNode) +
              ");\n";
          } else if (printNode.getMessage() instanceof CFVariableNode) {
            code +=
              "print(" +
              (printNode.getMessage() as CFVariableNode).getVarName() +
              ");\n";
          } else {
            code += 'print("' + (printNode.getMessage() as string) + '");\n';
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
              default:
                code += variableNode.getVarValue() as string;
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
  initializeVariables(indentationLevel:number): string {
    let code = "";
    this.variables.entries().forEach((entry) => {
      code += `${"\t".repeat(indentationLevel)}`;
      switch (entry[1].getVarType()) {
        case DataType.Character:
          code +=
            entry[1].getVarName() +
            " = '" +
            entry[1].getInitialVarValue() +
            "'";
          break;
        case DataType.String:
          code +=
            entry[1].getVarName() +
            ' = "' +
            entry[1].getInitialVarValue() +
            '"';
          break;
        case DataType.Integer:
          code += entry[1].getVarName() + " = " + entry[1].getInitialVarValue();
          break;
        case DataType.Decimal:
          code += entry[1].getVarName() + " = " + entry[1].getInitialVarValue();
          break;
        case DataType.Boolean:
          code += entry[1].getVarName() + " = " + entry[1].getInitialVarValue();
          break;
        default:
          code += entry[1].getInitialVarValue();
      }
      code += ";\n";
    });
    return code;
  }
}
