import styles from "./page.module.css";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { CFPrintNode } from "@/app/(utils)/nodes";

type PrintNodeProps = {
  readonly data: any;
};

export default function PrintNode({ data }: PrintNodeProps) {
  const { updateNode } = useReactFlow();

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
        value={data.cfNodeData.getMessage()}
        onChange={(e) => {
          const cfPrintNode = data.cfNodeData as CFPrintNode;
          cfPrintNode.setMessage(e.target.value);

          updateNode(cfPrintNode.getId(), data);
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
