import { Grid, GridProps, IconButton, Typography } from "@mui/joy";
import { Space } from "../utils/row";
import { SyncControls } from "./markets/sync-controls";
import { TargetChart } from "./target-chart";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Collapse } from "@mui/material";
import { useState } from "react";
import SectionHeader from "./secton-header";

const G = (props: GridProps) => <Grid xs={12} md={4} sm={6} {...props} />;

export const Markets = () => {
  const [collapsed, setCollapsed] = useState(
    localStorage.getItem("Markets") === "true"
  );
  const open = !collapsed;
  return (
    <>
      <Grid xs={12}>
        <Space py={1} sb c pr={16}>
          <SectionHeader
            title="Markets"
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
          <SyncControls />
        </Space>
      </Grid>
      <G>
        <Collapse in={open}>
          <TargetChart set="source" />
        </Collapse>
      </G>
      <G>
        <Collapse in={open}>
          <TargetChart set="target" />
        </Collapse>
      </G>
      <G>
        <Collapse in={open}>
          <TargetChart set="target2" />
        </Collapse>
      </G>
    </>
  );
};
