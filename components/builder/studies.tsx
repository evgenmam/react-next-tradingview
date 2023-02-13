import {
  Box,
  Checkbox,
  FormControl,
  FormLabel,
  Grid,
  Stack,
  Tab,
  TabList,
  Tabs,
  Typography,
} from "@mui/joy";
import { Pagination } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
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
  const [selected, setSelected] = useState([0]);
  const [expand, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState(1);
  useEffect(() => {
    console.log(view);
    setSelected(
      Array(view)
        .fill(0)
        .map((_, i) => i)
    );
  }, [view]);
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
      <Tabs defaultValue={1} variant="soft" onChange={(_, e) => setView(+e)}>
        <TabList>
          <Tab value={1}>1 study</Tab>
          <Tab value={2}>2 studies</Tab>
          <Tab value={4}>4 studies</Tab>
        </TabList>
      </Tabs>
      <Box flexGrow={1}>
        <Grid container spacing={1} padding={0}>
          {R.uniq(selected.map((i) => active.at(i)!).filter((v) => !!v)).map(
            (study) => (
              <Grid
                xs={12}
                sm={view === 1 ? 12 : 6}
                md={view === 1 ? 12 : 6}
                key={study.id}
              >
                <StudyChart study={study} view={view} />
              </Grid>
            )
          )}
        </Grid>
      </Box>
    </Stack>
  );
};
