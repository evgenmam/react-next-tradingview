import dynamic from "next/dynamic";

import { Theme, ThemeWrapper } from "../components/theme";
import XScrollbar from "../components/utils/scrollbars";
import { HoverWrapper } from "../hooks/hover.hook";

const TVBuilder = dynamic(() => import("../components/builder"), {
  ssr: false,
});

const BuilderPage = () => {
  return <TVBuilder />;
};
export default BuilderPage;
