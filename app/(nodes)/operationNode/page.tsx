"use client";
import styles from "./page.module.css";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { CFOperationNode } from "@/app/(utils)/nodes";
import { IoIosAddCircle } from "react-icons/io";
import { MdOutlineDeleteOutline } from "react-icons/md";
import toast from "react-hot-toast";

type OperationNodeProps = {
  readonly data: any;
};

export default function OperationNode({ data }: OperationNodeProps) {
  const { updateNode } = useReactFlow();

  function getOperationName(): string {
    switch ((data.cfNodeData as CFOperationNode).getOperator()) {
      case "+":
        return "ADD";
      case "-":
        return "SUBTRACT";
      case "*":
        return "MULTIPLY";
      case "/":
        return "DIVIDE";
      case "%":
        return "MODULUS";
      default:
        return "ADD";
    }
  }

  return (
    <div className={styles.node}>
      <h3>{getOperationName()}</h3>
      {(data.cfNodeData as CFOperationNode).getOperands().map((m, idx) => {
        if (typeof m === "string") {
          return (
            <div
              key={data.cfNodeData.getId() + idx}
              style={{ display: "flex", alignItems: "center", padding: "10px" }}
            >
              <Handle
                type="target"
                position={Position.Left}
                isConnectable={true}
                id={data.cfNodeData.getId() + "$" + idx}
                style={{ width: "12px", height: "12px" }}
                className={styles.operandsHandle}
              />
              <input
                value={m.toString()}
                placeholder="Value"
                type="number"
                className={styles.inputField}
                onChange={(e) => {
                  const cfOperationNode = data.cfNodeData as CFOperationNode;
                  cfOperationNode.updateOperand(idx, e.target.value);
                  updateNode(cfOperationNode.getId(), data);
                }}
              ></input>
              <button
                className={styles.deleteOperand}
                onClick={() => {
                  const cfOperationNode = data.cfNodeData as CFOperationNode;
                  if (cfOperationNode.getOperands().length == 2) {
                    toast.error("Should have atleast two operands");
                    return;
                  }
                  cfOperationNode.removeOperand(idx);
                  updateNode(cfOperationNode.getId(), data);
                }}
              >
                <MdOutlineDeleteOutline />
              </button>
            </div>
          );
        } else {
          return (
            <div key={data.cfNodeData.getId() + idx} style={{ margin: "10px" }}>
              <Handle
                type="target"
                position={Position.Left}
                isConnectable={true}
                id={data.cfNodeData.getId() + "$" + idx}
                style={{ width: "12px", height: "12px" }}
                className={styles.operandsHandle}
              />
            </div>
          );
        }
      })}
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={true}
        style={{ width: "12px", height: "12px" }}
        className={styles.handle}
      />
      <div className={styles.addOperand}>
        <button
          onClick={() => {
            const cfOperationNode = data.cfNodeData as CFOperationNode;
            cfOperationNode.addOperand("");
            updateNode(cfOperationNode.getId(), data);
          }}
        >
          <IoIosAddCircle />
        </button>
      </div>
    </div>
  );
}
