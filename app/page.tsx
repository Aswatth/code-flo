"use client";
import styles from "./page.module.css";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import StartNode from "./(nodes)/startNode/page";
import CodeArea from "./(code-area)/page";
import { fileNameStore } from "./(utils)/(data_stores)/fileNameStore";

export default function Home() {
  const { fileName, setFileName } = fileNameStore();

  const nodeTypes = { startNode: StartNode };

  const initialNodes = [
    {
      id: "startNode",
      position: { x: 100, y: 100 },
      type: "startNode",
      data: { label: "start" },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  return (
    <div className={styles.page}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        onNodesChange={onNodesChange}
        className={styles.designSpace}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
        <div className={styles.fileName}>
          <input
            type="text"
            placeholder="Filename"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          ></input>
        </div>
      </ReactFlow>
      <div className={styles.code}>
        <CodeArea></CodeArea>
      </div>
    </div>
  );
}
