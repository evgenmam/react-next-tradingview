import {
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  Grid,
  Stack,
  Typography,
} from "@mui/joy";
import { Pagination } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";
import { useSettings } from "../../hooks/settings.hook";
import { PaginationDots } from "../utils/pagination-dots";
import XScrollbar from "../utils/scrollbars";
import { useActiveStudies } from "../v2/hooks/v2-data.hook";
import { StudyChart } from "./study-chart";
import { StudyToggleDropdown } from "./study-toggle-dropdown";
import * as R from "ramda";

export const Studies = () => {
  const { studies, active } = useActiveStudies();
  const { legends, setLegends } = useSettings();
  const [selected, setSelected] = useState([0, 1]);

  return (
    <Stack>
      <Stack
        py={1}
        direction="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography>Indicators/Studies</Typography>
          <StudyToggleDropdown />
        </Stack>
        <PaginationDots
          selected={selected}
          total={active.length}
          onSelect={setSelected}
        />
        <Checkbox
          variant="solid"
          label="Show Legends"
          checked={!!legends}
          onChange={(e) => setLegends(e.target.checked)}
        />
      </Stack>
      <Box flexGrow={1}>
        <Grid container spacing={1} padding={0}>
          {R.uniq(selected.map((i) => active.at(i)!).filter((v) => !!v)).map(
            (study) => (
              <Grid xs={12} sm={6} md={6} key={study.id}>
                <StudyChart study={study} />
              </Grid>
            )
          )}
        </Grid>
      </Box>
    </Stack>
  );
};
