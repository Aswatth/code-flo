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
import CodeArea from "./(code-area)/codeArea";
import { fileNameStore } from "./(utils)/(data_stores)/fileNameStore";
import { IoMdAdd } from "react-icons/io";
import React, { useCallback, useRef, useState } from "react";
import StartNode from "./(nodes)/startNode/page";
import PrintNode from "./(nodes)/printNode/page";
import { CFPrintNode, CFStartNode } from "./(utils)/nodes";
import ContextMenu from "./context-menu/page";
import { RFNodeData, startNodeId } from "./(utils)/globals";
import VariableSpace from "./(variable-space)/variableSpace";
import VariableNode from "./(nodes)/variableNode/page";
import { VariableStore } from "./(utils)/(data_stores)/variableStore";
import PaneContextMenu from "./pane-context-menu/page";

export default function Home() {
  const { fileName, setFileName } = fileNameStore();
  const [menu, setMenu] = useState(null);
  const [paneMenu, setPaneMenu] = useState(null);
  const ref = useRef(null);
  const nodeTypes = {
    startNode: StartNode,
    printNode: PrintNode,
    variableNode: VariableNode,
  };

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
  const { variables } = VariableStore();

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

  const onPaneClick = useCallback(() => {
    setMenu(null);
    setPaneMenu(null);
  }, [setMenu, setPaneMenu]);

  const onPaneContextMenu = useCallback(
    (event: any) => {
      event.preventDefault();

      const pane = ref.current.getBoundingClientRect();

      setPaneMenu({
        top: event.clientY - pane.top,
        left: event.clientX - pane.left,
      });
    },
    [setPaneMenu]
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const data = JSON.parse(
        event.dataTransfer.getData("application/code-flo")
      );
      if (!data) return;

      const position = {
        x: event.clientX,
        y: event.clientY,
      };

      const newNodeId = data.varId + new Date().toISOString();
      const newNode: RFNodeData = {
        id: newNodeId,
        type: data.nodeType,
        position,
        data: {
          cfNodeData: variables.get(data.varId)!,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [variables]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onVariableDelete = (deletedId: string) => {
    setNodes((nds) => nds.filter((f) => !f.id.startsWith(deletedId)));
  };

  return (
    <div className={styles.page}>
      <div className={styles.variableSpace}>
        <VariableSpace onDelete={onVariableDelete}></VariableSpace>
      </div>
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
        onPaneContextMenu={onPaneContextMenu}
        className={styles.designSpace}
        onDrop={onDrop}
        onDragOver={onDragOver}
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
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
        {paneMenu && <PaneContextMenu onClick={onPaneClick} {...paneMenu} />}
      </ReactFlow>
      <div className={styles.code}>
        {<CodeArea nodes={nodes} edges={edges}></CodeArea>}
      </div>
    </div>
  );
}
