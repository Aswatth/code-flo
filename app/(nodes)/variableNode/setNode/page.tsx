import styles from "./page.module.css";
import { Handle, Position } from "@xyflow/react";
import { CFVariableNode } from "@/app/(utils)/nodes";
import { DataType } from "@/app/(utils)/dataType";
import { VariableStore } from "@/app/(utils)/(data_stores)/variableStore";
import { ChangeEvent } from "react";

type SetNodeProps = {
  readonly data: any;
};

export default function SetNode({ data }: SetNodeProps) {
  const { setVariable } = VariableStore();

  function inputField() {
    const variableNodeData = data.cfNodeData as CFVariableNode;
    const variableType = variableNodeData.getVarType();

    const handleInputChange = (
      e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
      variableNodeData.setVarValue(e.target.value);
      setVariable(variableNodeData);
    };

    if (variableType == DataType.Integer || variableType == DataType.Decimal) {
      return <input type="number" onChange={handleInputChange}></input>;
    } else if (variableType == DataType.Character) {
      return (
        <input type="text" maxLength={1} onChange={handleInputChange}></input>
      );
    } else if (variableType == DataType.Boolean) {
      return (
        <select
          value={variableNodeData.getVarValue()}
          onChange={handleInputChange}
        >
          <option value={"True"}>True</option>
          <option value={"False"}>False</option>
        </select>
      );
    } else {
      return <input type="text" onChange={handleInputChange}></input>;
    }
  }
  return (
    <div className={styles.node}>
      <h3>
        Set <i>{"\t" + (data.cfNodeData as CFVariableNode).getVarName()}</i>
      </h3>
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

        {inputField()}
      </div>
    </div>
  );
}
