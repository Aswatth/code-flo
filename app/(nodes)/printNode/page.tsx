import { nodeStore } from "@/app/(utils)/(data_stores)/nodeStore";
import styles from "./page.module.css";
import { Handle, Position } from "@xyflow/react";
import { CFPrintNode } from "@/app/(utils)/nodes";

type PrintNodeProps = {
  id: string;
};

export default function PrintNode({ id }: PrintNodeProps) {
  const { nodeMap, setNode } = nodeStore();

  return (
    <div className={styles.node}>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={true}
        style={{ width: "12px", height: "12px" }}
      />
      <h3>PRINT</h3>
      <input
        className={styles.messageField}
        value={(nodeMap.get(id) as CFPrintNode).getMessage()}
        onChange={(e) => {
          const printNode = nodeMap.get(id) as CFPrintNode;
          printNode.setMessage(e.target.value);
          setNode(id, printNode);
        }}
      ></input>
      <div className={styles.content}></div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={true}
        style={{ width: "12px", height: "12px" }}
      />
    </div>
  );
}
