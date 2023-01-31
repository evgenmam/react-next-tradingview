import { Box, Grid, Stack, Typography } from "@mui/joy";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import XScrollbar from "../utils/scrollbars";
import { useActiveStudies } from "../v2/hooks/v2-data.hook";
import { StudyChart } from "./study-chart";

export const Studies = () => {
  const { studies } = useActiveStudies();
  return (
    <Stack height="100%">
      <Box py={1}>
        <Typography>Indicators/Studies</Typography>
      </Box>
      <Box flexGrow={1} overflow="hidden">
        <XScrollbar>
          <Stack position="relative">
            <Box
              onScroll={(e) => e.stopPropagation()}
              position="absolute"
              top={0}
              right={15}
              height="100%"
              width={100}
              zIndex={200}
            />
            <Grid2 container>
              {studies.map((study) => (
                <Grid2 xs={12} md={12 / studies.length} sm={6} key={study.id}>
                  <StudyChart study={study} />
                </Grid2>
              ))}
            </Grid2>
          </Stack>
        </XScrollbar>
      </Box>
    </Stack>
  );
};
