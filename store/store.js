import { configureStore } from "@reduxjs/toolkit";
import recordingsReducer from "./recordingsSlice";

const store = configureStore({
  reducer: {
    recordings: recordingsReducer,
  },
});

export default store;
