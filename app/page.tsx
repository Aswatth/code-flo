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
  reconnectEdge,
  Edge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import CodeArea from "./(code-area)/codeArea";
import { fileNameStore } from "./(utils)/(data_stores)/fileNameStore";
import React, { useCallback, useRef, useState } from "react";
import StartNode from "./(nodes)/startNode/page";
import PrintNode from "./(nodes)/printNode/page";
import {
  CFNode,
  CFOperationNode,
  CFPrintNode,
  CFSetVariableNode,
  CFStartNode,
  CFVariableNode,
} from "./(utils)/nodes";
import ContextMenu from "./context-menu/page";
import { RFNodeData, startNodeId } from "./(utils)/globals";
import VariableSpace from "./(variable-space)/variableSpace";
import VariableNode from "./(nodes)/variableNode/page";
import { VariableStore } from "./(utils)/(data_stores)/variableStore";
import PaneContextMenu from "./pane-context-menu/page";
import OperationNode from "./(nodes)/operationNode/page";
import toast, { Toaster } from "react-hot-toast";
import SetNode from "./(nodes)/variableNode/setNode/page";
import { DataType } from "./(utils)/dataType";

export default function Home() {
  const { fileName } = fileNameStore();
  const [menu, setMenu] = useState(null);
  const [paneMenu, setPaneMenu] = useState(null);
  const ref = useRef(null);
  const edgeReconnectSuccessful = useRef(true);
  const nodeTypes = {
    startNode: StartNode,
    printNode: PrintNode,
    variableNode: VariableNode,
    setNode: SetNode,
    operationNode: OperationNode,
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

  function validateEdge(connection: Connection): boolean {
    //Ensure execution handles don't connect to value handles.
    if (
      (connection.sourceHandle == null && connection.targetHandle != null) ||
      (connection.sourceHandle != null && connection.targetHandle == null)
    ) {
      toast.error((t) => (
        <div>
          <p>
            <b>Invalid connection</b>
          </p>
          <p>Cannot connect execution handle to value handle</p>
        </div>
      ));
      return false;
    }

    // Validate data type of value handles.

    // Variable to set-variable node
    if (
      connection.source.startsWith("VARIABLE") &&
      connection.target.startsWith("SET-") &&
      connection.targetHandle == "set"
    ) {
      const sourceCfNode = nodes.find((f) => f.id == connection.source)?.data
        .cfNodeData as CFVariableNode;
      const targetCfNode = nodes.find((f) => f.id == connection.target)?.data
        .cfNodeData as CFSetVariableNode;

      if (sourceCfNode.getVarType() != targetCfNode.getVarType()) {
        toast.error((t) => (
          <div>
            <p>
              <b>Error</b>
            </p>
            <p>
              {`Expected ${targetCfNode.getVarType()} but got ${sourceCfNode.getVarType()}`}
            </p>
          </div>
        ));
        return false;
      }
    }

    // Operation to set-variable node
    if (
      connection.source.startsWith("OPERATION") &&
      connection.target.startsWith("SET-") &&
      connection.targetHandle == "set"
    ) {
      const sourceCfNode = nodes.find((f) => f.id == connection.source)?.data
        .cfNodeData as CFOperationNode;
      const targetCfNode = nodes.find((f) => f.id == connection.target)?.data
        .cfNodeData as CFSetVariableNode;

      if (sourceCfNode.getOutputDataType() != targetCfNode.getVarType()) {
        toast.error((t) => (
          <div>
            <p>
              <b>Error</b>
            </p>
            <p>
              {`Expected ${targetCfNode.getVarType()} but got ${sourceCfNode.getOutputDataType()}`}
            </p>
          </div>
        ));
        return false;
      }
    }

    // Variable to operation node.
    if (
      connection.source.startsWith("VARIABLE") &&
      connection.target.startsWith("OPERATION") &&
      connection.targetHandle?.startsWith("OPERATION")
    ) {
      const sourceCfNode = nodes.find((f) => f.id == connection.source)?.data
        .cfNodeData as CFVariableNode;

      if (
        sourceCfNode.getVarType() != DataType.Integer &&
        sourceCfNode.getVarType() != DataType.Decimal
      ) {
        toast.error((t) => (
          <div>
            <p>
              <b>Error</b>
            </p>
            <p>
              {`Expected Integer or Decimal but got ${sourceCfNode.getVarType()}`}
            </p>
          </div>
        ));
        return false;
      }
    }

    // Operation to operation node.
    if (
      connection.source.startsWith("OPERATION") &&
      connection.target.startsWith("OPERATION") &&
      connection.targetHandle?.startsWith("OPERATION")
    ) {
      const sourceCfNode = nodes.find((f) => f.id == connection.source)?.data
        .cfNodeData as CFOperationNode;

      if (
        sourceCfNode.getOutputDataType() != DataType.Integer &&
        sourceCfNode.getOutputDataType() != DataType.Decimal
      ) {
        toast.error((t) => (
          <div>
            <p>
              <b>Error</b>
            </p>
            <p>
              {`Expected Integer or Decimal but got ${sourceCfNode.getOutputDataType()}`}
            </p>
          </div>
        ));
        return false;
      }
    }
    return true;
  }

  const onConnect = useCallback(
    (connectionState: Connection) => {
      const sourceCfNode = nodes.find((f) => f.id == connectionState.source)
        ?.data.cfNodeData;
      const targetCfNode = nodes.find((f) => f.id == connectionState.target)
        ?.data.cfNodeData;
      if (!validateEdge(connectionState)) return;
      if (
        connectionState.sourceHandle == null &&
        connectionState.targetHandle == null
      ) {
        sourceCfNode?.setNextNode(targetCfNode!);
      } else if (
        (sourceCfNode instanceof CFVariableNode ||
          sourceCfNode instanceof CFOperationNode) &&
        targetCfNode instanceof CFPrintNode &&
        connectionState.targetHandle == "printValue"
      ) {
        targetCfNode.setMessage(sourceCfNode);
      } else if (
        (sourceCfNode instanceof CFVariableNode ||
          sourceCfNode instanceof CFOperationNode) &&
        targetCfNode instanceof CFSetVariableNode &&
        connectionState.targetHandle == "set"
      ) {
        targetCfNode.setVarValue(sourceCfNode);
      } else if (
        (sourceCfNode instanceof CFVariableNode ||
          sourceCfNode instanceof CFOperationNode) &&
        targetCfNode instanceof CFOperationNode
      ) {
        const indexToUpdate = parseInt(
          connectionState.targetHandle?.split("$")[1]!
        );
        targetCfNode.updateOperand(indexToUpdate, sourceCfNode);
      }
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

  const onVariableDelete = useCallback(
    (deletedId: string) => {
      // Set next incoming source node's next node to NULL
      const incomingEdges = edges.filter((f) =>
        f.target.startsWith("SET-" + deletedId)
      );
      incomingEdges.forEach((f) => {
        nodes
          .filter((n) => n.id.startsWith(f.source))
          .forEach((e) => {
            (e.data.cfNodeData as CFNode).setNextNode(null);
          });
      });

      //Variable node connected to print node
      let edge = edges.find(
        (f) => f.source.startsWith(deletedId) && f.target.startsWith("PRINT")
      );
      if (edge) {
        const printNode = nodes.find((f) => f.id == edge.target)?.data
          .cfNodeData as CFPrintNode;
        printNode.setMessage("");
      }

      // Variable node connected to operation node
      edge = edges.find(
        (f) =>
          f.source.startsWith(deletedId) && f.target.startsWith("OPERATION")
      );
      if (edge) {
        const operationNode = nodes.find((f) => f.id == edge.target)?.data
          .cfNodeData as CFOperationNode;
        const indexToUpdate = parseInt(edge.targetHandle.split("$")[1]);
        operationNode.updateOperand(indexToUpdate, "");
      }

      // Delete all variable and set-variable nodes for the given id.
      setNodes((nds) =>
        nds.filter(
          (f) =>
            !f.id.startsWith(deletedId) && !f.id.startsWith("SET-" + deletedId)
        )
      );

      // Delete all edges to and from variable and set-variable nodes.
      setEdges((edges) =>
        edges.filter(
          (edge) =>
            !edge.source.startsWith(deletedId) &&
            !edge.target.startsWith(deletedId) &&
            !edge.source.startsWith("SET-" + deletedId) &&
            !edge.target.startsWith("SET-" + deletedId)
        )
      );
    },
    [nodes, edges]
  );

  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnect = useCallback((oldEdge: any, newConnection: any) => {
    edgeReconnectSuccessful.current = true;
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  }, []);

  const onReconnectEnd = useCallback(
    (_: any, edge: Edge) => {
      if (!edgeReconnectSuccessful.current) {
        if (
          (edge.source.startsWith("VARIABLE") ||
            edge.source.startsWith("OPERATION")) &&
          edge.target.startsWith("PRINT") &&
          edge.targetHandle == "printValue"
        ) {
          const printNode = nodes.find((f) => f.id == edge.target);
          (printNode?.data.cfNodeData as CFPrintNode).setMessage("");
        } else if (
          (edge.source.startsWith("VARIABLE") ||
            edge.source.startsWith("OPERATION")) &&
          edge.target.startsWith("SET-") &&
          edge.targetHandle == "set"
        ) {
          const variableNode = nodes.find((f) => f.id == edge.target);
          (variableNode?.data.cfNodeData as CFSetVariableNode).setVarValue("");
        } else if (
          (edge.source.startsWith("VARIABLE") ||
            edge.source.startsWith("OPERATION")) &&
          edge.target.startsWith("OPERATION")
        ) {
          const operationNode = nodes.find((f) => f.id == edge.target);
          const indexToUpdate = parseInt(edge.targetHandle?.split("$")[1]!);
          (operationNode?.data.cfNodeData as CFOperationNode).updateOperand(
            indexToUpdate,
            ""
          );
        }

        const node = nodes.find((f) => f.id == edge.source);
        node?.data.cfNodeData.setNextNode(null);
        setEdges((eds) => eds.filter((e) => e.id !== edge.id));
      }

      edgeReconnectSuccessful.current = true;
    },
    [nodes]
  );

  return (
    <div className={styles.page}>
      <div>
        <Toaster position="top-center" />
      </div>
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
        onReconnect={onReconnect}
        onReconnectStart={onReconnectStart}
        onReconnectEnd={onReconnectEnd}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        onPaneContextMenu={onPaneContextMenu}
        className={styles.designSpace}
        onDrop={onDrop}
        onDragOver={onDragOver}
        snapToGrid={false}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
        {paneMenu && <PaneContextMenu onClick={onPaneClick} {...paneMenu} />}
      </ReactFlow>
      <div className={styles.code}>
        {<CodeArea nodes={nodes} edges={edges}></CodeArea>}
      </div>
    </div>
  );
}
