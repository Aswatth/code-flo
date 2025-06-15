"use client";

import { useState } from "react";

import styles from "./page.module.css";
import { CFVariableNode } from "@/app/(utils)/nodes";
import { VariableStore } from "@/app/(utils)/(data_stores)/variableStore";
import { MdOutlineDelete } from "react-icons/md";
import { useReactFlow } from "@xyflow/react";

interface VariableProps {
  readonly cfVariable: CFVariableNode;
  onDelete: CallableFunction;
}

export default function Variable({ cfVariable, onDelete }: VariableProps) {
  const { setVariable, deleteVariable } = VariableStore();

  const variableTypes = [
    { displayName: "Integer", keyword: "int" },
    { displayName: "Decimal", keyword: "float" },
    { displayName: "Character", keyword: "char" },
    { displayName: "Text", keyword: "string" },
    { displayName: "True or False", keyword: "boolean" },
  ];
  const [selectedVariableType, setSelectedVariableType] = useState("Integer");

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
              setSelectedVariableType(e.target.value);
              cfVariable.setVarType(
                variableTypes.find((f) => f.displayName == e.target.value)
                  ?.keyword!
              );
              cfVariable.setVarValue("");
              setVariable(cfVariable);
            }}
          >
            {variableTypes.map((v) => {
              return <option key={v.displayName}>{v.displayName}</option>;
            })}
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
          {selectedVariableType != "True or False" ? (
            <input
              id="varValue"
              type={
                selectedVariableType == "Integer" ||
                selectedVariableType == "Decimal"
                  ? "number"
                  : "text"
              }
              maxLength={selectedVariableType == "Character" ? 1 : undefined}
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

        <div className={styles.deleteButton} onClick={handleDelete}>
          <MdOutlineDelete />
        </div>
      </div>
    </button>
  );
}
