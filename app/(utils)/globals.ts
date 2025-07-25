import { CFOperationNode, CFPrintNode, CFSetVariableNode, CFStartNode, CFVariableNode } from "./nodes";

export const startNodeId:string = "START";

export interface RFNodeData {
    id: string,
    type:string,
    position: {
        x: number,
        y: number,
    },
    data: {
        cfNodeData: CFStartNode | CFPrintNode | CFVariableNode | CFSetVariableNode | CFOperationNode
    }
}