import { IconButton } from "@mui/joy";
import { Space } from "./row";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useSettings } from "../../hooks/settings.hook";
import { useCallback } from "react";

type ThemeToggleProps = {};

export const ThemeToggle = ({}: ThemeToggleProps) => {
  const { setTheme, theme } = useSettings();
  const st = useCallback(
    (mode: "dark" | "light") => {
      if (theme !== mode) {
        setTheme(mode);
        setTimeout(() => {
          window.location.reload();
        }, 400);
      }
    },
    [setTheme, theme]
  );
  return (
    <Space>
      <IconButton
        variant="plain"
        color={theme == "light" ? "primary" : "neutral"}
        onClick={() => st("light")}
      >
        <SunIcon width={24} />
      </IconButton>
      <IconButton
        variant="plain"
        onClick={() => st("dark")}
        color={theme == "dark" ? "primary" : "neutral"}
      >
        <MoonIcon width={24} />
      </IconButton>
    </Space>
  );
};

export default ThemeToggle;
