"use client";
import styles from "./page.module.css";

import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  BackgroundVariant,
  Connection,
  applyEdgeChanges,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import CodeArea from "./(code-area)/page";
import { fileNameStore } from "./(utils)/(data_stores)/fileNameStore";
import { IoMdAdd } from "react-icons/io";
import { useCallback, useEffect } from "react";
import { nodeStore } from "./(utils)/(data_stores)/nodeStore";
import StartNode from "./(nodes)/startNode/page";
import PrintNode from "./(nodes)/printNode/page";
import { CFPrintNode, CFStartNode } from "./(utils)/nodes";

export default function Home() {
  const { fileName, setFileName } = fileNameStore();
  const { nodeMap, setNode } = nodeStore();

  const nodeTypes = { startNode: StartNode, printNode: PrintNode };

  const initialNodes = [
    {
      id: "START",
      position: { x: 100, y: 100 },
      type: "startNode",
      data: { label: "start" },
    },
  ];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const { edges, setEdges } = nodeStore();

  useEffect(() => {
    const startNode = new CFStartNode(null, fileName);
    setNode("START", startNode);
  }, []);

  const handleAddNode = () => {
    const newNode = {
      id: "PRINT-" + new Date().toISOString(),
      type: "printNode",
      position: {
        x: 200,
        y: 200,
      },
      data: { label: "PRINT" },
    };
    setNode(newNode.id, new CFPrintNode(null, "Hello world"));
    setNodes((nds) => nds.concat(newNode));
  };

  const onConnect = useCallback((connectionState: Connection) => {
    setEdges(connectionState);
  }, []);

  return (
    <div className={styles.page}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={(changes) => setEdges(applyEdgeChanges(changes, edges))}
        onConnect={onConnect}
        className={styles.designSpace}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <div className={styles.fileName}>
          <input
            type="text"
            placeholder="Filename"
            value={fileName}
            onChange={(e) => {
              const startNode = nodeMap.get("START") as CFStartNode;
              startNode.setFileName(e.target.value);
              setNode("START", startNode);

              setFileName(e.target.value);
            }}
          ></input>
        </div>
        <button className={styles.addNodeButton} onClick={handleAddNode}>
          <IoMdAdd /> Add node
        </button>
      </ReactFlow>
      <div className={styles.code}>
        <CodeArea></CodeArea>
      </div>
    </div>
  );
}
