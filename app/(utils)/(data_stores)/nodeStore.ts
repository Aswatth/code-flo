import { create } from 'zustand'
import { CFNode } from '../nodes';
import { addEdge, Connection, Edge } from '@xyflow/react';

interface NodeMap {
  nodeMap: Map<string, CFNode |null>,
  edges: Edge[],
  setNode: (id:string, nodeToAdd: CFNode |null) => void,
  setEdges: (connection: Connection) => void,
}

export const nodeStore = create<NodeMap>((set) => ({
    nodeMap: new Map<string, CFNode|null>(),
    edges: [],
    setNode: (id, nodeToAdd) => { set((state) => {
      const updatedMap = new Map(state.nodeMap);
      updatedMap.set(id, nodeToAdd);
      return {nodeMap: updatedMap}
    })
    },
    setEdges: (connection) =>
    {
      set((state) => {

        const sourceNode = state.nodeMap.get(connection.source);
        const targetNode = state.nodeMap.get(connection.target);
        sourceNode?.setNextNode(targetNode!);

        return {edges: addEdge(connection, state.edges)};
      })
  }
})
)