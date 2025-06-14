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
  addEdge,
  useEdgesState,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import CodeArea from "./(code-area)/page";
import { fileNameStore } from "./(utils)/(data_stores)/fileNameStore";
import { IoMdAdd } from "react-icons/io";
import { useCallback, useRef, useState } from "react";
import StartNode from "./(nodes)/startNode/page";
import PrintNode from "./(nodes)/printNode/page";
import { CFPrintNode, CFStartNode } from "./(utils)/nodes";
import ContextMenu from "./context-menu/page";
import { RFNodeData, startNodeId } from "./(utils)/globals";

export default function Home() {
  const { fileName, setFileName } = fileNameStore();
  const [menu, setMenu] = useState(null);
  const ref = useRef(null);
  const nodeTypes = { startNode: StartNode, printNode: PrintNode };

  const initialNode: RFNodeData = {
    id: startNodeId,
    position: { x: 100, y: 100 },
    type: "startNode",
    data: {
      cfNodeData: new CFStartNode(startNodeId, fileName, null),
    },
  };

  const [nodes, setNodes, onNodesChange] = useNodesState([initialNode]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const handleAddNode = () => {
    const newNodeId = "PRINT-" + new Date().toISOString();
    const newNode: RFNodeData = {
      id: newNodeId,
      type: "printNode",
      position: {
        x: 200,
        y: 200,
      },
      data: { cfNodeData: new CFPrintNode(newNodeId, "Hello world", null) },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onConnect = useCallback(
    (connectionState: Connection) => {
      const sourceCfNode = nodes.find((f) => f.id == connectionState.source)
        ?.data.cfNodeData;
      const targetCfNode = nodes.find((f) => f.id == connectionState.target)
        ?.data.cfNodeData;

      sourceCfNode?.setNextNode(targetCfNode!);
      setEdges((edge) => addEdge(connectionState, edge));
    },
    [nodes, setEdges]
  );

  const onNodeContextMenu = useCallback(
    (event: any, node: any) => {
      event.preventDefault();

      const pane = ref.current.getBoundingClientRect();

      // Should not delete START node.
      if (node.id != startNodeId) {
        setMenu({
          id: node.id,
          top: event.clientY < pane.height - 200 && event.clientY,
          left: event.clientX < pane.width - 200 && event.clientX,
          right:
            event.clientX >= pane.width - 200 && pane.width - event.clientX,
          bottom:
            event.clientY >= pane.height - 200 && pane.height - event.clientY,
        });
      }
    },
    [setMenu]
  );

  const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

  return (
    <div className={styles.page}>
      <ReactFlow
        ref={ref}
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
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
              const startNode = nodes.find((f) => f.id == startNodeId)?.data
                .cfNodeData! as CFStartNode;
              startNode.setFileName(e.target.value);
              setFileName(e.target.value);
            }}
          ></input>
        </div>
        <button className={styles.addNodeButton} onClick={handleAddNode}>
          <IoMdAdd /> Add node
        </button>
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
      </ReactFlow>
      <div className={styles.code}>
        {<CodeArea nodes={nodes} edges={edges}></CodeArea>}
      </div>
    </div>
  );
}
