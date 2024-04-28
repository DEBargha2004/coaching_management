import { Batch } from "@/types/batch";
import { produce } from "immer";
import { create } from "zustand";

type Actions = {
  setBatches: (fn: (state: State) => void) => void;
};
type State = {
  batches: Batch[];
};

export const useBatchStore = create<State & Actions>((set) => ({
  batches: [],
  setBatches: (fn) => {
    set(
      produce((state: State) => {
        fn(state);
      })
    );
  },
}));
