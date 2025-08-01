import styles from "./page.module.css";
import {
  Handle,
  Position,
    useReactFlow,
} from "@xyflow/react";
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
        className={styles.handle}
      />
      <h3>PRINT</h3>
      <div className={styles.printValue}>
        <Handle
          type="target"
          position={Position.Left}
          id="printValue"
          isConnectable={true}
          className={styles.printValueHandle}
        />
        {typeof (data.cfNodeData as CFPrintNode).getMessage() === "string" ? (
          <input
            className={styles.messageField}
            value={data.cfNodeData.getMessage()}
            onChange={(e) => {
              const cfPrintNode = data.cfNodeData as CFPrintNode;
              cfPrintNode.setMessage(e.target.value);

              updateNode(cfPrintNode.getId(), data);
            }}
          ></input>
        ) : (
          <div />
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={true}
        className={styles.handle}
      />
    </div>
  );
}
