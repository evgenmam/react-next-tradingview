import {
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  Grid,
  Stack,
  Typography,
} from "@mui/joy";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useSettings } from "../../hooks/settings.hook";
import XScrollbar from "../utils/scrollbars";
import { useActiveStudies } from "../v2/hooks/v2-data.hook";
import { StudyChart } from "./study-chart";
import { StudyToggleDropdown } from "./study-toggle-dropdown";

export const Studies = () => {
  const { studies } = useActiveStudies();
  const { legends, setLegends } = useSettings();
  return (
    <Stack>
      <Stack
        py={1}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography>Indicators/Studies</Typography>
          <StudyToggleDropdown />
        </Stack>
        <Checkbox
          variant="solid"
          label="Show Legends"
          checked={!!legends}
          onChange={(e) => setLegends(e.target.checked)}
        />
      </Stack>
      <Box flexGrow={1}>
        <Grid2 container spacing={2}>
          {studies
            ?.filter((v) => !v.config?.hidden)
            .map((study) => (
              <Grid2 xs={12} md={12 / studies.length} sm={6} key={study.id}>
                <StudyChart study={study} />
              </Grid2>
            ))}
        </Grid2>
      </Box>
    </Stack>
  );
};
