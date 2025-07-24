import React, { useCallback } from "react";
import { useReactFlow, getIncomers } from "@xyflow/react";
import styles from "./page.module.css";
import {
  CFNode,
  CFOperationNode,
  CFPrintNode,
  CFVariableNode,
} from "../(utils)/nodes";
import { RFNodeData } from "../(utils)/globals";

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: any) {
  const { getNode, getNodes, setNodes, setEdges, getEdges } = useReactFlow();

  const deleteSelectedode = useCallback(() => {
    const node = getNode(id)!;
    const edges = getEdges();
    const nodes = getNodes();

    const incomers = getIncomers(node, nodes, edges);

    // Handle deletion of variable node when connected to a print node.
    let edge = edges.find(
      (f) => f.source.startsWith(id) && f.target.startsWith("PRINT")
    );
    if (edge) {
      const printNode = nodes.find((f) => f.id == edge!.target)?.data
        .cfNodeData as CFPrintNode;
      printNode.setMessage("");
    }
    edge = edges.find(
      (f) => f.source.startsWith(id) && f.target.startsWith("OPERATION")
    );
    if (edge) {
      const operationNode = nodes.find((f) => f.id == edge.target)?.data
        .cfNodeData as CFOperationNode;
      const indexToDelete = parseInt(edge.targetHandle?.split("$")[1]!);
      operationNode.updateOperand(indexToDelete, "");
    }

    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== id && edge.target !== id)
    );

    incomers.forEach((source) => {
      const cfNode = source.data.cfNodeData as CFNode;
      cfNode?.setNextNode(null);
    });
  }, [id, setNodes, setEdges]);

  const convertToSetNode = () => {
    //Delete current node.
    deleteSelectedode();

    //Create a new set node for the deleted variable node.
    const node = getNode(id)!;
    const nodePosition = node.position;

    const newNodeId = "SET-" + id + "-" + new Date().toISOString();
    const newNode: RFNodeData = {
      id: newNodeId,
      type: "setNode",
      position: nodePosition,
      data: {
        cfNodeData: node.data.cfNodeData as CFVariableNode,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div
      style={{ top, left, right, bottom }}
      className={styles.contextMenu}
      {...props}
    >
      <button onClick={deleteSelectedode}>Delete node</button>
      {(id as string).startsWith("VARIABLE") ? (
        <button onClick={convertToSetNode}>Convert to SET node</button>
      ) : (
        <div></div>
      )}
    </div>
  );
}
