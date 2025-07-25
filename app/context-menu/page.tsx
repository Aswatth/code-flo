import React, { useCallback } from "react";
import { useReactFlow, getIncomers } from "@xyflow/react";
import styles from "./page.module.css";
import {
  CFNode,
  CFOperationNode,
  CFPrintNode,
  CFSetVariableNode,
  CFVariableNode,
} from "../(utils)/nodes";
import { RFNodeData } from "../(utils)/globals";
import { SetVariableStore } from "../(utils)/(data_stores)/variableStore";

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}: any) {
  const { getNode, getNodes, setNodes, setEdges, getEdges } = useReactFlow();
  const { updateSetVariable } = SetVariableStore();

  const deleteSelectedode = useCallback(() => {
    const node = getNode(id)!;
    const edges = getEdges();
    const nodes = getNodes();

    const incomers = getIncomers(node, nodes, edges);

    // Handle deletion of a node when connected to a print node.
    let edge = edges.find(
      (f) =>
        f.source.startsWith(id) &&
        f.target.startsWith("PRINT") &&
        f.targetHandle == "printValue"
    );
    console.log(edges);
    if (edge != undefined) {
      const printNode = nodes.find((f) => f.id == edge!.target)?.data
        .cfNodeData as CFPrintNode;
      printNode.setMessage("");
    }

    // Handle deletion of a node when connected to operation node.
    edge = edges.find(
      (f) => f.source.startsWith(id) && f.target.startsWith("OPERATION")
    );
    if (edge) {
      const operationNode = nodes.find((f) => f.id == edge!.target)?.data
        .cfNodeData as CFOperationNode;
      const indexToDelete = parseInt(edge.targetHandle?.split("$")[1]!);
      operationNode.updateOperand(indexToDelete, "");
    }

    // Handle deletion of a node when connected to set-variable node
    edge = edges.find(
      (f) =>
        f.source.startsWith(id) &&
        f.target.startsWith("SET-") &&
        f.targetHandle == "set"
    );
    if (edge) {
      const setVariableNode = nodes.find((f) => f.id == edge.target)?.data
        .cfNodeData as CFSetVariableNode;
      setVariableNode.setVarValue("");
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
    const setVariableNode = new CFSetVariableNode(
      newNodeId,
      node.data.cfNodeData as CFVariableNode,
      null
    );
    updateSetVariable(setVariableNode);
    const newNode: RFNodeData = {
      id: newNodeId,
      type: "setNode",
      position: nodePosition,
      data: {
        cfNodeData: setVariableNode,
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
