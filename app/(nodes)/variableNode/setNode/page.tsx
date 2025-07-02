import styles from "./page.module.css";
import { Handle, Position } from "@xyflow/react";
import { CFVariableNode } from "@/app/(utils)/nodes";

type SetNodeProps = {
  readonly data: any;
};

export default function SetNode({ data }: SetNodeProps) {
  return (
    <div className={styles.node}>
      <h3>Set</h3>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={true}
        className={styles.handle}
      />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={true}
        className={styles.handle}
      />
      <div className={styles.variable}>
        <Handle
          type="target"
          id="set"
          position={Position.Left}
          isConnectable={true}
          className={styles.variableHandle}
        />
        {(data.cfNodeData as CFVariableNode).getVarName()}
      </div>
    </div>
  );
}
