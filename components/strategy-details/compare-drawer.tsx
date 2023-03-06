import { Drawer } from "@mui/material";
import { queryTypes, useQueryState } from "next-usequerystate";
import { createContext, Dispatch, SetStateAction, useState } from "react";
import CompareBody from "./compare/compare-body";
import { ISStats } from "./hooks/strategy-stats";

type CompareDrawerProps = {};

export const CompareDrawer = ({}: CompareDrawerProps) => {
  const [open, setOpen] = useQueryState(
    "compare",
    queryTypes.boolean.withDefault(false)
  );

  return (
    <Drawer anchor="bottom" open={open} onClose={() => setOpen(false)}>
      {open && <CompareBody onClose={() => setOpen(false)} />}
    </Drawer>
  );
};

export default CompareDrawer;
