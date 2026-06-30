import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "../slice/AuthSlice";
import WorkoutReducer from "../slice/WorkoutSlice";
import ThemeReducer from "../slice/ThemeSlice";

const Store = configureStore({
  reducer: {
    auth: AuthReducer,
    workout: WorkoutReducer,
    theme: ThemeReducer,
  },
});

export default Store;
