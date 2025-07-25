"use client";

import { useState } from "react";

import styles from "./page.module.css";
import { CFVariableNode } from "@/app/(utils)/nodes";
import {
  SetVariableStore,
  VariableStore,
} from "@/app/(utils)/(data_stores)/variableStore";
import { MdOutlineDelete } from "react-icons/md";
import { DataType } from "@/app/(utils)/dataType";

interface VariableProps {
  readonly cfVariable: CFVariableNode;
  readonly onDelete: CallableFunction;
}

export default function Variable({ cfVariable, onDelete }: VariableProps) {
  const { updateVariable, deleteVariable } = VariableStore();
  const { setVariablesMap, updateSetVariable } = SetVariableStore();

  const [selectedVariableType, setSelectedVariableType] = useState(
    DataType.Integer
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData(
      "application/code-flo",
      JSON.stringify({ nodeType: nodeType, varId: cfVariable.getId() })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDelete = () => {
    onDelete(cfVariable.getId());
    deleteVariable(cfVariable.getId());
  };

  return (
    <button
      draggable
      className={styles.variable}
      onDragStart={(event) => onDragStart(event, "variableNode")}
    >
      <div className={styles.content}>
        <div className={styles.label}>
          <label htmlFor="varType">Type:</label>
        </div>
        <div className={styles.field}>
          <select
            id="varType"
            value={selectedVariableType}
            onChange={(e) => {
              setSelectedVariableType(e.target.value as DataType);
              cfVariable.setVarType(e.target.value as DataType);
              if ((e.target.value as DataType) == DataType.Boolean) {
                cfVariable.setInitialVarValue("True");
              } else {
                cfVariable.setInitialVarValue("");
              }
              updateVariable(cfVariable);

              //Update set variable nodes
              const setVariableList = setVariablesMap.entries().filter((f) => {
                return f[0].split("SET-")[1].startsWith(cfVariable.getId());
              });
              console.log(setVariableList);
              setVariableList.forEach((f) => {
                if ((e.target.value as DataType) == DataType.Boolean) {
                  f[1].setVarValue("True");
                } else {
                  f[1].setVarValue("");
                }
                updateSetVariable(f[1]);
              });
            }}
          >
            {Object.entries(DataType).map(([key, value]) => (
              <option key={key} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.label}>
          <label htmlFor="varName">Name:</label>
        </div>
        <div className={styles.field}>
          <input
            id="varName"
            type="text"
            value={cfVariable.getVarName()}
            onChange={(e) => {
              cfVariable.setVarName(e.target.value);
              updateVariable(cfVariable);
            }}
          ></input>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.label}>
          <label htmlFor="varValue">Value:</label>
        </div>
        <div className={styles.field}>
          {selectedVariableType != DataType.Boolean ? (
            <input
              id="varValue"
              type={
                selectedVariableType == DataType.Integer ||
                selectedVariableType == DataType.Decimal
                  ? "number"
                  : "text"
              }
              maxLength={
                selectedVariableType == DataType.Character ? 1 : undefined
              }
              value={cfVariable.getInitialVarValue()}
              onChange={(e) => {
                cfVariable.setInitialVarValue(e.target.value);
                updateVariable(cfVariable);
              }}
            ></input>
          ) : (
            <select
              value={cfVariable.getInitialVarValue()}
              onChange={(e) => {
                cfVariable.setInitialVarValue(e.target.value);
                updateVariable(cfVariable);
              }}
            >
              <option value={"True"}>True</option>
              <option value={"False"}>False</option>
            </select>
          )}
        </div>

        <div
          role="button"
          className={styles.deleteButton}
          onClick={handleDelete}
        >
          <MdOutlineDelete />
        </div>
      </div>
    </button>
  );
}
