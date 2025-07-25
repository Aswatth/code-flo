import { DataType } from "./dataType";
import { Operator } from "./operator";

export class CFNode {
  private readonly id: string = "";
  private readonly name: string = "";
  constructor(id: string, name: string, private nextNode: CFNode | null) {
    this.nextNode = nextNode;
    this.id = id;
    this.name = name;
  }
  getId(): string {
    return this.id;
  }
  getName(): string {
    return this.name;
  }
  setNextNode(nextNode: CFNode | null) {
    this.nextNode = nextNode;
  }
  getNextNode(): CFNode | null {
    return this.nextNode;
  }
}

export class CFStartNode extends CFNode {
  constructor(id: string, private fileName: string, nextNode: CFNode | null) {
    super(id, "START", nextNode);
    this.fileName = fileName;
  }
  setFileName(fileName: string) {
    this.fileName = fileName;
  }
  getFileName(): string {
    return this.fileName;
  }
}

type MessageType = string | CFOperationNode | CFVariableNode;

export class CFPrintNode extends CFNode {
  constructor(
    id: string,
    private message: MessageType,
    nextNode: CFNode | null
  ) {
    super(id, "PRINT", nextNode);
    this.message = message;
  }
  setMessage(message: MessageType) {
    this.message = message;
  }
  getMessage(): MessageType {
    return this.message;
  }
}

export class CFVariableNode extends CFNode {
  constructor(
    id: string,
    private varType: DataType,
    private varName: string,
    private initialVarValue: string,
    nextNode: CFNode | null
  ) {
    super(id, "VARIABLE", nextNode);
    this.varType = varType;
    this.varName = varName;
    this.initialVarValue = initialVarValue;
  }
  setVarType(type: DataType) {
    this.varType = type;
  }
  setVarName(name: string) {
    this.varName = name;
  }
  setInitialVarValue(value: string) {
    this.initialVarValue = value;
  }

  getVarType() {
    return this.varType;
  }
  getVarName() {
    return this.varName;
  }
  getInitialVarValue() {
    return this.initialVarValue;
  }
}

type VarValueType = string | CFVariableNode | CFOperationNode;
export class CFSetVariableNode extends CFNode {
  private varValue: VarValueType;
  constructor(
    id: string,
    private readonly variableNode: CFVariableNode,
    nextNode: CFNode | null
  ) {
    super(id, "SET-VARIABLE", nextNode);
    this.varValue = "";
  }

  getVarName(): string {
    return this.variableNode.getVarName();
  }

  getVarType(): DataType {
    return this.variableNode.getVarType();
  }

  setVarValue(value: VarValueType) {
    this.varValue = value;
  }

  getVarValue() {
    return this.varValue;
  }
}

export class CFOperationNode extends CFNode {
  constructor(
    id: string,
    private readonly operator: Operator,
    private operands: VarValueType[],
    nextNode: CFNode | null
  ) {
    super(id, "OPERATION", nextNode);
    this.operator = operator;
    this.operands = operands;
  }

  getOperands() {
    return this.operands;
  }
  getOperator() {
    return this.operator;
  }
  addOperand(operand: VarValueType) {
    this.operands.push(operand);
  }
  updateOperand(index: number, operand: VarValueType) {
    this.operands[index] = operand;
  }
  removeOperand(indexToRemove: number) {
    this.operands.splice(indexToRemove, 1);
  }
  setOperands(operands: VarValueType[]) {
    this.operands = operands;
  }
}
