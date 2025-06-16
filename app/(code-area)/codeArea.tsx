"use client";
import { useEffect, useState } from "react";
import { fileNameStore } from "../(utils)/(data_stores)/fileNameStore";
import { languageStore } from "../(utils)/(data_stores)/languageStore";
import styles from "./page.module.css";
import { JavaCodeGenerator } from "../(utils)/code-generators/javaCodeGenerator";
import { CodeGenerator } from "../(utils)/code-generators/codeGenerator";
import { PythonCodeGenerator } from "../(utils)/code-generators/pythonCodeGenerator";
import { CFStartNode } from "../(utils)/nodes";
import { Edge } from "@xyflow/react";
import { RFNodeData, startNodeId } from "../(utils)/globals";
import { VariableStore } from "../(utils)/(data_stores)/variableStore";

type CodeAreaProps = {
  readonly nodes: RFNodeData[];
  readonly edges: Edge[];
};

export default function CodeArea({ nodes, edges }: CodeAreaProps) {
  const { language, fileExtension, setLanguage } = languageStore();
  const { fileName } = fileNameStore();
  const [code, setCode] = useState("");
  const { variables } = VariableStore();

  useEffect(() => {
    const startNode = nodes.find((f) => f.id == startNodeId)?.data
      .cfNodeData! as CFStartNode;
    let codeGenerator: CodeGenerator;
    if (language == "Java") {
      codeGenerator = new JavaCodeGenerator(variables);
    } else {
      codeGenerator = new PythonCodeGenerator(variables);
    }
    setCode(codeGenerator.generateCode(startNode));
  }, [fileName, language, variables, nodes, edges]);

  const handleDownload = () => {
    const blob = new Blob([code]);

    const url = URL.createObjectURL(blob);
    const linkElement = document.createElement("a");
    linkElement.href = url;
    linkElement.download = fileName + fileExtension;

    document.body.appendChild(linkElement);

    linkElement.click();

    document.body.removeChild(linkElement);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.page}>
      <select
        value={language}
        className={styles.languageOption}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option>Java</option>
        <option>Python</option>
        <option>Javascript</option>
        <option>Go</option>
      </select>
      <div className={styles.code}>{code}</div>
      <button className={styles.downloadButton} onClick={handleDownload}>
        Download code
      </button>
    </div>
  );
}
