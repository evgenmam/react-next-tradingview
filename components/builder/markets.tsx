import { Grid, GridProps } from "@mui/joy";
import { Space } from "../utils/row";
import { SyncControls } from "./markets/sync-controls";
import { TargetChart } from "./target-chart";
import { Collapse } from "@mui/material";
import { useState } from "react";
import SectionHeader from "./secton-header";
import ThemeToggle from "../utils/theme-toggle";

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
          <Space s={1} c>
            <ThemeToggle />
            <SyncControls />
          </Space>
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
