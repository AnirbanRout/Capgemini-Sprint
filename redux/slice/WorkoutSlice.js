import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  workouts: [],
  lastWorkout: null,
  workoutHistory: [],
  eatenMeals: [],
};

const workoutSlice = createSlice({
  name: "workout",
  initialState,
  reducers: {
    // WORKOUTS
    addWorkout: (state, action) => {
      state.workouts.push(action.payload);
      state.lastWorkout = action.payload;
    },

    removeWorkout: (state, action) => {
      state.workouts = state.workouts.filter(
        (workout) => workout.id !== action.payload.id,
      );
    },

    setLastWorkout: (state, action) => {
      state.lastWorkout = action.payload;
    },

    clearWorkouts: (state) => {
      state.workouts = [];
      state.lastWorkout = null;
    },

    // WORKOUT HISTORY
    addWorkoutHistory: (state, action) => {
      state.workoutHistory.push(action.payload);
    },

    // NUTRITION
    addEatenMeal: (state, action) => {
      state.eatenMeals.push(action.payload);
    },

    removeEatenMeal: (state, action) => {
      state.eatenMeals = state.eatenMeals.filter(
        (meal) => meal.id !== action.payload,
      );
    },

    // CLEAR ALL ACTIVITY
    clearUserActivity: (state) => {
      state.workoutHistory = [];
      state.eatenMeals = [];
    },
  },
});

export const {
  addWorkout,
  removeWorkout,
  setLastWorkout,
  clearWorkouts,
  addWorkoutHistory,
  addEatenMeal,
  removeEatenMeal,
  clearUserActivity,
} = workoutSlice.actions;

export default workoutSlice.reducer;
