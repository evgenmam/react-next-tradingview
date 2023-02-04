import { Box, Container, CssVarsProvider } from "@mui/joy";
import dynamic from "next/dynamic";

import { Theme, ThemeWrapper } from "../components/theme";
import XScrollbar from "../components/utils/scrollbars";
import { HoverWrapper } from "../hooks/hover.hook";

const StrategyDetails = dynamic(
  () => import("../components/strategy-details"),
  {
    ssr: false,
  }
);

const BuilderPage = () => {
  return <StrategyDetails />;
};
export default BuilderPage;
