import styles from "./page.module.css";
import { Handle, Position } from "@xyflow/react";
import { CFSetVariableNode, CFVariableNode } from "@/app/(utils)/nodes";
import { DataType, getPinColor } from "@/app/(utils)/dataType";
import { SetVariableStore } from "@/app/(utils)/(data_stores)/variableStore";
import { ChangeEvent } from "react";

type SetNodeProps = {
  readonly data: any;
};

export default function SetNode({ data }: SetNodeProps) {
  const { updateSetVariable } = SetVariableStore();

  function inputField() {
    const variableNodeData = data.cfNodeData as CFSetVariableNode;
    const variableType = variableNodeData.getVarType();

    if (typeof variableNodeData.getVarValue() === "string") {
      const handleInputChange = (
        e: ChangeEvent<HTMLSelectElement | HTMLInputElement>
      ) => {
        variableNodeData.setVarValue(e.target.value);
        updateSetVariable(variableNodeData);
      };

      if (
        variableType == DataType.Integer ||
        variableType == DataType.Decimal
      ) {
        return (
          <input
            type="number"
            value={variableNodeData.getVarValue() as string}
            onChange={handleInputChange}
          ></input>
        );
      } else if (variableType == DataType.Character) {
        return (
          <input
            type="text"
            value={variableNodeData.getVarValue() as string}
            maxLength={1}
            onChange={handleInputChange}
          ></input>
        );
      } else if (variableType == DataType.Boolean) {
        return (
          <select
            value={variableNodeData.getVarValue() as string}
            onChange={handleInputChange}
          >
            <option value={"True"}>True</option>
            <option value={"False"}>False</option>
          </select>
        );
      } else {
        return (
          <input
            type="text"
            value={variableNodeData.getVarValue() as string}
            onChange={handleInputChange}
          ></input>
        );
      }
    }
  }
  return (
    <div className={styles.node}>
      <h3>
        SET <i>{"\t" + (data.cfNodeData as CFVariableNode).getVarName()}</i>
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
          style={{
            backgroundColor: getPinColor(
              (data.cfNodeData as CFVariableNode).getVarType()
            ),
          }}
        />

        {inputField()}
      </div>
    </div>
  );
}
