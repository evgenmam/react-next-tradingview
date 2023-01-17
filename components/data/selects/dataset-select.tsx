import { FormControl, FormLabel, Option, Select, SelectProps } from "@mui/joy";
import { useDatasets, useSettings } from "../../../hooks/data.hook";
import { Box } from "@mui/system";
import { SelectDialog } from "../../dialogs/select-dialog";
import { Button, Stack, Typography } from "@mui/material";
import { CsvUpload } from "../../csv/csv-upload";
import { useRef, useState } from "react";
type Props = {
  dataset: "source" | "target" | "target2";
  label?: string;
} & SelectProps<string>;

export const DatasetSelect = ({ dataset, label, ...props }: Props) => {
  const { datasets, remove } = useDatasets();
  const s = useSettings();
  const value = s?.[dataset] || null;
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {label && <Typography>{label}:</Typography>}
      <SelectDialog
        options={datasets}
        value={value}
        actions={<CsvUpload dataset="target" onFinish={s.sett(dataset)} />}
        onDelete={remove}
        onChange={s.sett(dataset)}
      />
    </Stack>
  );
};
