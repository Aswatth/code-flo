"use client";

import styles from "./page.module.css";
import { IoMdAdd } from "react-icons/io";
import Variable from "./(variable)/variable";
import { VariableStore } from "../(utils)/(data_stores)/variableStore";
import { CFVariableNode } from "../(utils)/nodes";

type VariableSpaceProps = {
  readonly onDelete: CallableFunction
}

export default function VariableSpace({onDelete}:VariableSpaceProps) {
  const { variables, setVariable } = VariableStore();

  const handleAddVariable = () => {
    const nodeId = "VARIABLE-" + new Date().toISOString();
    setVariable(new CFVariableNode(nodeId, "int", "", "", null));
  };

  return (
    <div className={styles.page}>
      <div className={styles.title}>
        <h3>Variables</h3>
        <button className={styles.addButton} onClick={handleAddVariable}>
          {" "}
          <IoMdAdd /> Add
        </button>
      </div>
      <div className={styles.variables}>
        {Array.from(variables.entries()).map((m) => {
          return <Variable key={m[0]} cfVariable={m[1]} onDelete={onDelete}></Variable>;
        })}
      </div>
    </div>
  );
}
