import { create } from "zustand";
import { CFSetVariableNode, CFVariableNode } from "../nodes";

interface VariableState {
  variables: Map<string,CFVariableNode>,
  updateVariable: (variable: CFVariableNode) => void,
  deleteVariable: (id:string) => void,
}

export const VariableStore = create<VariableState>((set) => ({
    variables: new Map<string,CFVariableNode>(),
    updateVariable: (variable) => set((state) => {
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

interface SetVariableState {
  setVariablesMap: Map<string,CFSetVariableNode>,
  updateSetVariable: (variable: CFSetVariableNode) => void,
  deleteSetVariable: (id:string) => void,
}

export const SetVariableStore = create<SetVariableState>((set) => ({
    setVariablesMap: new Map<string,CFSetVariableNode>(),
    updateSetVariable: (variable) => set((state) => {
        const map = new Map(state.setVariablesMap);
        map.set(variable.getId(), variable);
        return {setVariablesMap: map};
    }),
    deleteSetVariable: (id) => set((state) => {
        const map = new Map(state.setVariablesMap);
        map.delete(id);
        return {setVariablesMap: map};
    })
})
);
