import { create } from 'zustand'

const fileExtensionMap = new Map<string, string>([
    ["Java", ".java"],
    ["Python", ".py"],
    ["Javascript", ".js"],
    ["Go", ".go"]
]);

interface LanguageState {
  language: string,
  fileExtension: string,
  setLanguage: (lang: string) => void
}

export const languageStore = create<LanguageState>((set) => ({
    language: "Java",
    fileExtension: fileExtensionMap.get("Java")!,
    setLanguage: (lang) => {
        set(() => ({language: lang, fileExtension: fileExtensionMap.get(lang)}));
    }
})
)