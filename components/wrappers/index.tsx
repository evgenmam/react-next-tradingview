import { Container, CssVarsProvider } from "@mui/joy";
import { SnackbarProvider } from "notistack";
import { Children, FC, ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Theme, ThemeWrapper } from "../theme";

const MuiWrapper: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <CssVarsProvider theme={Theme}>
      <DndProvider backend={HTML5Backend}>
        <SnackbarProvider>
          <Container
            maxWidth={false}
            sx={(a) => {
              return {
                bgcolor: a.palette.background.level1,
                height: "100vh",
                pl: 0,
                pr: 0,
                position: "relative",
              };
            }}
          >
            {children}
          </Container>
        </SnackbarProvider>
        <ThemeWrapper />
      </DndProvider>
    </CssVarsProvider>
  );
};

export default MuiWrapper;
