import { createSlice } from "@reduxjs/toolkit";

const ThemeSlice = createSlice({
  name: "theme",
  initialState: {
    darkMode: false,
  },
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
  },
});

export default ThemeSlice.reducer;
export const { toggleDarkMode } = ThemeSlice.actions;
