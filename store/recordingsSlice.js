import { createSlice } from "@reduxjs/toolkit";

const recordingsSlice = createSlice({
  name: "recordings",
  initialState: [],
  reducers: {
    addRecording: (state, action) => {
      state.push(action.payload);
    },
    deleteRecording: (state, action) => {
      return state.filter((_, index) => index !== action.payload);
    },
  },
});

export const { addRecording, deleteRecording } = recordingsSlice.actions;

export default recordingsSlice.reducer;
