import styles from "./page.module.css";
import { Handle, Position } from "@xyflow/react";

export default function StartNode() {
  return (
    <div className={styles.node}>
      <h3>START</h3>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={true}
        style={{ width: "12px", height: "12px" }}
      />
    </div>
  );
}
