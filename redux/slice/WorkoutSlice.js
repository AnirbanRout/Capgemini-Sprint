import { createSlice } from "@reduxjs/toolkit";

const WorkoutSlice = createSlice({
  name: "workout",
  initialState: {
    workouts: [],
    lastWorkout: null,
  },
  reducers: {
    addWorkout: (state, action) => {
      state.workouts.push(action.payload);
      state.lastWorkout = action.payload;
    },
    removeWorkout: (state, action) => {
      state.workouts = state.workouts.filter((workout) => {
        return workout.id !== action.payload.id;
      });
    },
    setLastWorkout: (state, action) => {
      state.lastWorkout = action.payload;
    },
    clearWorkouts: (state) => {
      state.workouts = [];
      state.lastWorkout = null;
    },
  },
});

export default WorkoutSlice.reducer;
export const { addWorkout, removeWorkout, setLastWorkout, clearWorkouts } =
  WorkoutSlice.actions;
