import { useReactFlow } from "@xyflow/react";
import styles from "./page.module.css";
import { RFNodeData } from "../(utils)/globals";
import { CFPrintNode } from "../(utils)/nodes";

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

  return (
    <div style={{ top, left }} {...props} className={styles.contextMenu}>
      <h3>Nodes</h3>
      <hr />
      <div className={styles.nodeButton}>
        <button onClick={handleAddPrintNode}>Print</button>
      </div>
      <div className={styles.nodeButton}>
        <button>Add</button>
      </div>
      <div className={styles.nodeButton}>
        <button>Subtract</button>
      </div>
    </div>
  );
}
