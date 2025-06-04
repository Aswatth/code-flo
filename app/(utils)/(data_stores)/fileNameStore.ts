import { create } from 'zustand'

interface FileNameState {
  fileName: string
  setFileName: (fileName: string) => void
}

export const fileNameStore = create<FileNameState>((set) => ({
    fileName: "MyApp",
    setFileName: (fileName) => set(() => ({fileName: fileName}))
})
)