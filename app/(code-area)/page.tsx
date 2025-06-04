import { fileNameStore } from "../(utils)/(data_stores)/fileNameStore";
import { languageStore } from "../(utils)/(data_stores)/languageStore";
import styles from "./page.module.css";

export default function CodeArea() {
  const { language, fileExtension, setLanguage } = languageStore();
  const { fileName } = fileNameStore();


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
      <div className={styles.code}></div>
    </div>
  );
}
