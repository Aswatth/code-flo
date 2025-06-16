import { create } from "zustand";
import { CFVariableNode } from "../nodes";

interface VariableState {
  variables: Map<string,CFVariableNode>,
  setVariable: (variable: CFVariableNode) => void,
  deleteVariable: (id:string) => void,
}

export const VariableStore = create<VariableState>((set) => ({
    variables: new Map<string,CFVariableNode>(),
    setVariable: (variable) => set((state) => {
        const map = new Map(state.variables);
        map.set(variable.getId(), variable);
        return {variables: map};
    }),
    deleteVariable: (id) => set((state) => {
        const map = new Map(state.variables);
        map.delete(id);
        return {variables: map};
    })
})
);