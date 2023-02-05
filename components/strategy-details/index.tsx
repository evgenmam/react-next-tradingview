import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Box } from "@mui/system";
import { queryTypes, useQueryState } from "next-usequerystate";
import { useRouter } from "next/router";
import { MyStrategies } from "../builder/my-strategies";
import XScrollbar from "../utils/scrollbars";
import { StrategyData } from "./strategy-data";

const StrategyDetails = () => {
  const [id, setId] = useQueryState("id", queryTypes.integer.withDefault(0));
  return (
    <Grid2 container spacing={2}>
      <Grid2 xs={12} sm={4}>
        <Box height="100vh" overflow="hidden">
          <XScrollbar>
            <Box px={2}>
              <MyStrategies selected={id} onSelect={setId} />
            </Box>
          </XScrollbar>
        </Box>
      </Grid2>
      <Grid2 xs={12} sm={8} pt={6}>
        <StrategyData id={id} />
      </Grid2>
    </Grid2>
  );
};

export default StrategyDetails;
