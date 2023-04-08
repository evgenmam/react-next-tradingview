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
import { Collapse, Pagination } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import { useSettings } from "../../hooks/settings.hook";
import { PaginationDots } from "../utils/pagination-dots";
import XScrollbar from "../utils/scrollbars";
import { useActiveStudies } from "../v2/hooks/v2-data.hook";
import { StudyChart } from "./study-chart";
import { StudyToggleDropdown } from "./study-toggle-dropdown";
import * as R from "ramda";
import SectionHeader from "./secton-header";

export const Studies = () => {
  const { studies, active } = useActiveStudies();
  const { legends, setLegends } = useSettings();
  const [selected, setSelected] = useState([0]);
  const [view, setView] = useState(1);
  useEffect(() => {
    setSelected(
      Array(view)
        .fill(0)
        .map((_, i) => i)
    );
  }, [view]);
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("Indicators/Studies") === "true"
  );
  const open = !collapsed;
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
          <SectionHeader
            title="Indicators/Studies"
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />

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
      <Collapse in={open}>
        <Tabs defaultValue={1} variant="soft" onChange={(_, e) => setView(+e)}>
          <TabList>
            <Tab value={1}>1 study</Tab>
            <Tab value={2}>2 studies</Tab>
            <Tab value={4}>4 studies</Tab>
          </TabList>
        </Tabs>
      </Collapse>
      <Box flexGrow={1}>
        <Collapse in={open}>
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
        </Collapse>
      </Box>
    </Stack>
  );
};
