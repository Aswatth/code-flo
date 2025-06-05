"use client";
import { useEffect, useState } from "react";
import { fileNameStore } from "../(utils)/(data_stores)/fileNameStore";
import { languageStore } from "../(utils)/(data_stores)/languageStore";
import styles from "./page.module.css";
import { JavaParser } from "../(utils)/parsers/java_parser";
import { nodeStore } from "../(utils)/(data_stores)/nodeStore";
import { CFStartNode } from "../(utils)/nodes";
import { Parser } from "../(utils)/parsers/parser";
import { PythonParser } from "../(utils)/parsers/python_parser";

export default function CodeArea() {
  const { language, fileExtension, setLanguage } = languageStore();
  const { fileName } = fileNameStore();
  const { nodeMap, edges } = nodeStore();
  const [code, setCode] = useState("");

  useEffect(() => {
    let parser: Parser;
    if (language == "Java") {
      parser = new JavaParser(nodeMap.get("START")! as CFStartNode);
    } else {
      parser = new PythonParser(nodeMap.get("START")! as CFStartNode);
    }
    setCode(parser.parse());
  }, [nodeMap, edges, language]);

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
