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
import {
  SetVariableStore,
  VariableStore,
} from "../(utils)/(data_stores)/variableStore";
import SyntaxHighlighter from "react-syntax-highlighter";
import { a11yLight } from "react-syntax-highlighter/dist/esm/styles/hljs";

type CodeAreaProps = {
  readonly nodes: RFNodeData[];
  readonly edges: Edge[];
};

export default function CodeArea({ nodes, edges }: CodeAreaProps) {
  const { language, fileExtension, setLanguage } = languageStore();
  const { fileName, setFileName } = fileNameStore();
  const [code, setCode] = useState("");
  const { variables } = VariableStore();
  const { setVariablesMap } = SetVariableStore();

  useEffect(() => {
    const startNode = nodes.find((f) => f.id == startNodeId)?.data
      .cfNodeData! as CFStartNode;
    let codeGenerator: CodeGenerator;
    if (language == "Java") {
      codeGenerator = new JavaCodeGenerator(variables);
      setCode(codeGenerator.generateCode(startNode, 1));
    } else {
      codeGenerator = new PythonCodeGenerator(variables);
      setCode(codeGenerator.generateCode(startNode, 0));
    }
  }, [fileName, language, variables, setVariablesMap, nodes, edges]);

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
      <div className={styles.options}>
        <div className={styles.fileName}>
          <input
            type="text"
            placeholder="Filename"
            value={fileName}
            style={{ padding: "5px" }}
            onChange={(e) => {
              const startNode = nodes.find((f) => f.id == startNodeId)?.data
                .cfNodeData! as CFStartNode;
              startNode.setFileName(e.target.value);
              setFileName(e.target.value);
            }}
          ></input>
        </div>
        <select
          value={language}
          style={{ padding: "5px" }}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option>Java</option>
          <option>Python</option>
        </select>
      </div>
      <SyntaxHighlighter
        language={language.toLowerCase()}
        showLineNumbers={true}
        showInlineLineNumbers={true}
        style={a11yLight}
        customStyle={{ flex: "1" }}
      >
        {code}
      </SyntaxHighlighter>
      <button className={styles.downloadButton} onClick={handleDownload}>
        Download code
      </button>
    </div>
  );
}
