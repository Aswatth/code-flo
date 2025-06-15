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
    constructor(id:string, private message: string, nextNode:CFNode | null, ) {
        super(id, "PRINT", nextNode);
        this.message = message;
    }
    setMessage(message:string) {
        this.message = message;
    }
    getMessage():string {
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