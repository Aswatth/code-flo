export class CFNode {
    private readonly id:string = "";
    private readonly name:string = "";
    constructor(id:string, name:string, private nextNode: CFNode | null, ) {
        this.nextNode = nextNode;
        this.id = id;
        this.name = name;
    }
    getId():string {
        return this.id;
    }
    getName():string {
        return this.name;
    }
    setNextNode(nextNode: CFNode | null) {
      this.nextNode = nextNode;      
    }
    getNextNode() : CFNode | null {
        return this.nextNode;
    }
}

export class CFStartNode extends CFNode {
    constructor(id:string,private fileName:string, nextNode: CFNode | null, ) {
        super(id, "START", nextNode);
        this.fileName = fileName;
    }
    setFileName(fileName:string) {
        this.fileName = fileName;
    }
    getFileName():string {
        return this.fileName;
    }
}

export class CFPrintNode extends CFNode{
    constructor(id:string, private message: CFVariableNode|string, nextNode:CFNode | null, ) {
        super(id, "PRINT", nextNode);
        this.message = message;
    }
    setMessage(message:CFVariableNode|string) {
        this.message = message;
    }
    getMessage():CFVariableNode|string {
        if(this.message instanceof CFVariableNode) {
            return this.message;
        }
        
        return this.message;
    }
}

export class CFVariableNode extends CFNode {
    constructor(id:string, private varType: string, private varName: string, private varValue: string, nextNode:CFNode | null) {
        super(id, "VARIABLE", nextNode);
        this.varType = varType;
        this.varName = varName;
        this.varValue = varValue;
    }
    setVarType(type: string) {
        this.varType = type;
    }
    setVarName(name: string) {
        this.varName = name;
    }
    setVarValue(value: string) {
        this.varValue = value;
    }
    getVarType() {
        return this.varType;
    }
    getVarName() {
        return this.varName;
    }
    getVarValue() {
        return this.varValue;
    }
}

export class CFOperationNode extends CFNode {
    constructor(id:string, private operator:string, private operands:(CFOperationNode|CFVariableNode|string)[], nextNode: CFNode|null) {
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
    addOperand(operand: CFOperationNode|CFVariableNode|string) {
        this.operands.push(operand);
    }
    updateOperand(index: number, operand: CFOperationNode|CFVariableNode|string) {
        this.operands[index] = operand;
    }
    removeOperand(indexToRemove: number) {
        this.operands.splice(indexToRemove, 1);
    }
    setOperands(operands:(CFOperationNode|CFVariableNode|string)[]) {
        this.operands = operands;
    }
}