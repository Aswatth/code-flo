"use client";

import { useState } from "react";

import styles from "./page.module.css";
import { CFVariableNode } from "@/app/(utils)/nodes";
import {
  SetVariableStore,
  VariableStore,
} from "@/app/(utils)/(data_stores)/variableStore";
import { MdOutlineDelete } from "react-icons/md";
import { DataType, getPinColor } from "@/app/(utils)/dataType";
import toast from "react-hot-toast";

interface VariableProps {
  readonly cfVariable: CFVariableNode;
  readonly onDelete: CallableFunction;
}

export default function Variable({ cfVariable, onDelete }: VariableProps) {
  const { variables, updateVariable, deleteVariable } = VariableStore();
  const { setVariablesMap, updateSetVariable } = SetVariableStore();

  const [selectedVariableType, setSelectedVariableType] = useState(
    DataType.Integer
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    if (cfVariable.getVarName().length == 0) {
      toast.error("Variable name cannot be empty.");
      event.dataTransfer.setData("application/code-flo", JSON.stringify(null));
    } else {
      event.dataTransfer.setData(
        "application/code-flo",
        JSON.stringify({ nodeType: nodeType, varId: cfVariable.getId() })
      );
    }

    event.dataTransfer.effectAllowed = "move";
  };

  const handleDelete = () => {
    onDelete(cfVariable.getId());
    deleteVariable(cfVariable.getId());
  };

  function validateVariableName(value: string) {
    return /^[a-zA-Z_]+\w*$/.test(value);
  }

  function isVarNameAlreadyExists(name: string) {
    let result = false;
    variables.forEach((m) => {
      if (m.getId() != cfVariable.getId() && m.getVarName() == name) {
        result = true;
      }
    });
    return result;
  }

  return (
    <li
      draggable
      className={styles.variable}
      onDragStart={(event) => onDragStart(event, "variableNode")}
    >
      <div className={styles.content}>
        <div
          className={styles.label}
          style={{ display: "flex", alignItems: "center" }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: getPinColor(cfVariable.getVarType()),
            }}
          ></div>
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
                cfVariable.setInitialVarValue("False");
              } else {
                cfVariable.setInitialVarValue("");
              }
              updateVariable(cfVariable);

              //Update set variable nodes
              const setVariableList = setVariablesMap.entries().filter((f) => {
                return f[0].split("SET-")[1].startsWith(cfVariable.getId());
              });

              setVariableList.forEach((f) => {
                if (typeof f[1].getVarValue() === "string") {
                  if ((e.target.value as DataType) == DataType.Boolean) {
                    f[1].setVarValue("True");
                  } else {
                    f[1].setVarValue("");
                  }
                  updateSetVariable(f[1]);
                }
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
            maxLength={25}
            onChange={(e) => {
              if (validateVariableName(e.target.value)) {
                cfVariable.setVarName(e.target.value);
                updateVariable(cfVariable);
              }
            }}
          ></input>
        </div>
      </div>
      {isVarNameAlreadyExists(cfVariable.getVarName()) ? (
        <span className={styles.error}>Variable name already exists</span>
      ) : (
        <div></div>
      )}
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

        <button className={styles.deleteButton} onClick={handleDelete}>
          <MdOutlineDelete />
        </button>
      </div>
    </li>
  );
}
