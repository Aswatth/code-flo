import styles from "./page.module.css";
import { Handle, Position, useNodeConnections } from "@xyflow/react";

export default function StartNode() {
  const connections = useNodeConnections({
    handleType: "source",
  });
  
  return (
    <div className={styles.node}>
      <h3>START</h3>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={connections.length < 1}
        style={{ width: "12px", height: "12px" }}
      />
    </div>
  );
}
