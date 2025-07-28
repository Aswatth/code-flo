"use client";
import { useReactFlow } from "@xyflow/react";
import styles from "./page.module.css";
import { RFNodeData } from "../(utils)/globals";
import { CFOperationNode, CFPrintNode } from "../(utils)/nodes";
import { Operator } from "../(utils)/operator";

export default function PaneContextMenu({ top, left, ...props }: any) {
  const { addNodes } = useReactFlow();

  const handleAddPrintNode = () => {
    const newNodeId = "PRINT-" + new Date().toISOString();
    const newNode: RFNodeData = {
      id: newNodeId,
      type: "printNode",
      position: {
        x: left,
        y: top,
      },
      data: { cfNodeData: new CFPrintNode(newNodeId, "Hello world", null) },
    };

    addNodes(newNode);
  };

  const handleArithmeticOperationNode = (operator: Operator) => {
    const newNodeId = "OPERATION-" + new Date().toISOString();
    const newNode: RFNodeData = {
      id: newNodeId,
      type: "operationNode",
      position: {
        x: left,
        y: top,
      },
      data: {
        cfNodeData: new CFOperationNode(newNodeId, operator, ["", ""], null),
      },
    };

    addNodes(newNode);
  };

  return (
    <div style={{ top, left }} {...props} className={styles.contextMenu}>
      <h3>Nodes</h3>
      <hr />
      <div className={styles.nodeButton}>
        <button onClick={handleAddPrintNode}>Print</button>
      </div>
      <div className={styles.nodeButton}>
        <button onClick={() => handleArithmeticOperationNode(Operator.ADD)}>
          Add
        </button>
      </div>
      <div className={styles.nodeButton}>
        <button
          onClick={() => handleArithmeticOperationNode(Operator.SUBTRACT)}
        >
          Subtract
        </button>
      </div>
      <div className={styles.nodeButton}>
        <button
          onClick={() => handleArithmeticOperationNode(Operator.MULTIPLY)}
        >
          Multiply
        </button>
      </div>
      <div className={styles.nodeButton}>
        <button onClick={() => handleArithmeticOperationNode(Operator.DIVIDE)}>
          Divide
        </button>
      </div>
      <div className={styles.nodeButton}>
        <button onClick={() => handleArithmeticOperationNode(Operator.MODULUS)}>
          Modulus
        </button>
      </div>
    </div>
  );
}
