import { Box, Grid, GridProps, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { useRows } from "../../hooks/data.hook";
import XScrollbar from "../utils/scrollbars";
import { useActiveStudies } from "../v2/hooks/v2-data.hook";
import { PointerWrapper } from "./context/pointer.context";
import { RangeWrapper } from "./context/range.context";
import { StudyChart } from "./study-chart";
import { Studies } from "./stuides";
import { TargetChart } from "./target-chart";

const G = (props: GridProps) => <Grid xs={12} md={4} sm={6} {...props} />;
const TVBuilder = () => {
  return (
    <PointerWrapper>
      <RangeWrapper>
        <Grid container>
          <G>
            <TargetChart set="source" />
          </G>
          <G>
            <TargetChart set="target" />
          </G>
          <G>
            <TargetChart set="target2" />
          </G>
          <Grid xs={12}>
            <Studies />
          </Grid>
        </Grid>
      </RangeWrapper>
    </PointerWrapper>
  );
};

export default TVBuilder;
