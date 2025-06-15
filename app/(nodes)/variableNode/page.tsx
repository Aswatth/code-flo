import styles from "./page.module.css";
import { Handle, Position } from "@xyflow/react";
import { CFVariableNode } from "@/app/(utils)/nodes";

type VariableNodeProps = {
  readonly data: any;
};

export default function VariableNode({ data }: VariableNodeProps) {
  return (
    <div className={styles.node}>
      <h3>{(data.cfNodeData as CFVariableNode).getVarName()}</h3>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={true}
        className={styles.handle}
      />
    </div>
  );
}
