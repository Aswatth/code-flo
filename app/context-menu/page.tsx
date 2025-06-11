import React, { useCallback } from "react";
import { useReactFlow, getIncomers } from "@xyflow/react";
import styles from "./page.module.css";
import { nodeStore } from "../(utils)/(data_stores)/nodeStore";

export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}) {
  const { getNode, getNodes, setNodes, setEdges, getEdges } = useReactFlow();
  const { nodeMap, setNode } = nodeStore();

  const deleteSelectedode = useCallback(() => {
    const node = getNode(id)!;
    const edges = getEdges();
    const nodes = getNodes();

    const incomers = getIncomers(node, nodes, edges);

    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));

    incomers.forEach((source) => {
      const cfNode = nodeMap.get(source.id);
      console.log(cfNode);
      cfNode?.setNextNode(null);
      setNode(source.id, cfNode!);
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
