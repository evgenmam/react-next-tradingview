import { CircularProgress } from "@mui/joy";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useSettings } from "../../hooks/data.hook";

export const Loader = () => {
  const { fetching, setFetching } = useSettings();
  useEffect(() => {
    setFetching(false);
  }, []);
  if (!fetching) return null;
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(5px)",
        zIndex: 1500,
      }}
    >
      <Box
        sx={(t) => ({
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.5,
        })}
      ></Box>
      <CircularProgress color="neutral" size="lg" />
    </Box>
  );
};
