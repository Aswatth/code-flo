"use client";

import { useState } from "react";

import styles from "./page.module.css";
import { CFVariableNode } from "@/app/(utils)/nodes";
import { VariableStore } from "@/app/(utils)/(data_stores)/variableStore";
import { MdOutlineDelete } from "react-icons/md";
import { DataType } from "@/app/(utils)/dataType";

interface VariableProps {
  readonly cfVariable: CFVariableNode;
  readonly onDelete: CallableFunction;
}

export default function Variable({ cfVariable, onDelete }: VariableProps) {
  const { setVariable, deleteVariable } = VariableStore();

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
                cfVariable.setVarValue("True");
              } else {
                cfVariable.setVarValue("");
              }
              setVariable(cfVariable);
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
              setVariable(cfVariable);
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
              value={cfVariable.getVarValue()}
              onChange={(e) => {
                cfVariable.setVarValue(e.target.value);
                setVariable(cfVariable);
              }}
            ></input>
          ) : (
            <select
              value={cfVariable.getVarValue()}
              onChange={(e) => {
                cfVariable.setVarValue(e.target.value);
                setVariable(cfVariable);
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
