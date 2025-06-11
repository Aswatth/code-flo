export class CFNode {
    private readonly name:string = "";
    constructor(private nextNode: CFNode | null, name:string) {
        this.nextNode = nextNode;
        this.name = name;
    }
    setNextNode(nextNode: CFNode | null) {
      this.nextNode = nextNode;      
    }
    getNextNode() : CFNode | null {
        return this.nextNode;
    }
    getName():string {
        return this.name;
    }
}

export class CFStartNode extends CFNode {
    constructor(nextNode: CFNode | null, private fileName:string) {
        super(nextNode, "START");
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
    constructor(nextNode:CFNode | null, private message: string) {
        super(nextNode, "PRINT");
        this.message = message;
    }
    setMessage(message:string) {
        this.message = message;
    }
    getMessage():string {
        return this.message;
    }
}