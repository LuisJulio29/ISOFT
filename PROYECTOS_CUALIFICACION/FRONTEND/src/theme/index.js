/*
 * Copyright (c) 2023.
 * File Name: index.ts
 * Author: Coderthemes
 */
import { createTheme as muiCreateTheme } from "@mui/material";
import componentOverrides from "./components";
import gridTheme from "./grid";
import paletteTheme from "./palette";
import shadowTheme from "./shadow";
import typographyTheme from "./typography";
const createTheme = theme => {
  const themeOption = {
    palette: paletteTheme(theme),
    typography: typographyTheme(),
    breakpoints: gridTheme(),
    shape: {
      borderRadius: 4
    },
    spacing: 8,
    shadows: shadowTheme(theme),
    zIndex: {
      appBar: 1100,
      drawer: 1200
    }
  };
  return muiCreateTheme({
    ...themeOption,
    components: componentOverrides(themeOption)
  });
};
export { createTheme };