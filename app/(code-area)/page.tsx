import { fileNameStore } from "../(utils)/(data_stores)/fileNameStore";
import { languageStore } from "../(utils)/(data_stores)/languageStore";
import styles from "./page.module.css";

export default function CodeArea() {
  const { language, fileExtension, setLanguage } = languageStore();
  const { fileName } = fileNameStore();

  const handleDownload = () => {
    const blob = new Blob(["<PLACEHOLDER CODE>"]);

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
      <div className={styles.code}></div>
      <button className={styles.downloadButton} onClick={handleDownload}>
        Download code
      </button>
    </div>
  );
}
