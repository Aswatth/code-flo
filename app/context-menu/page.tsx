import React, { useCallback } from "react";
import { useReactFlow, getIncomers } from "@xyflow/react";
import styles from "./page.module.css";
import { CFNode } from "../(utils)/nodes";

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

    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));

    incomers.forEach((source) => {
      const cfNode = source.data.cfNodeData as CFNode;
      cfNode?.setNextNode(null);
    });
  }, [id, setNodes, setEdges]);

  return (
    <div
      style={{ top, left, right, bottom }}
      className={styles.contextMenu}
      {...props}
    >
      <p style={{ margin: "0.5em" }}>
        <small>node: {id}</small>
      </p>
      <button onClick={deleteSelectedode}>delete</button>
    </div>
  );
}
