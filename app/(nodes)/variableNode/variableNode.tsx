import styles from "./page.module.css";
import { Handle, Position } from "@xyflow/react";
import { CFVariableNode } from "@/app/(utils)/nodes";
import { getPinColor } from "@/app/(utils)/dataType";

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
        id={(data.cfNodeData as CFVariableNode).getId()}
        style={{
          width: "12px",
          height: "12px",
          border: "1px solid black",
          backgroundColor: getPinColor(
            (data.cfNodeData as CFVariableNode).getVarType()
          ),
        }}
      />
    </div>
  );
}
