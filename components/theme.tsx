import { FC, ReactNode, useEffect } from "react";
import { deepmerge } from "@mui/utils";
import { useSettings } from "../hooks/data.hook";
import { experimental_extendTheme as extendMuiTheme } from "@mui/material/styles";
import {
  extendTheme as extendJoyTheme,
  CssVarsProvider,
  useColorScheme,
} from "@mui/joy/styles";

const joyTheme = extendJoyTheme({
  cssVarPrefix: "mui",
});

const muiTheme = extendMuiTheme();

export const Theme = deepmerge(joyTheme, muiTheme);

export const ThemeWrapper = () => {
  const { theme } = useSettings();
  const { setMode } = useColorScheme();

  useEffect(() => {
    setMode(theme);
  }, [theme, setMode]);
  return <></>;
};
