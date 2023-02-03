import { FormControl, FormLabel, Option, Select, SelectProps } from "@mui/joy";
import { useFields } from "../../../hooks/data.hook";
import * as R from "ramda";
import { SelectDialog } from "../../dialogs/select-dialog";
import { Button } from "@mui/material";
type Props = {
  exclude?: string[];
  hideLabel?: boolean;
  datasource?: string;
  actions?: React.ReactNode;
} & SelectProps<string>;

export const FieldSelect = ({
  exclude = [],
  hideLabel,
  datasource = "source",
  actions,
  ...props
}: Props) => {
  const { fields } = useFields("source");
  const options = R.without(exclude, fields);
  return (
    <FormControl size="sm">
      {!hideLabel && <FormLabel>Data</FormLabel>}
      <SelectDialog
        options={options
          .map((v) => ({
            label: v.split("----")[0].split(":")[1] || v,
            value: v,
            group: v.split("----")[0]?.includes(":")
              ? v.split("----")[0].split(":")[0]
              : "null",
          }))}
        value={props.value}
        onChange={(v) => {
          props.onChange?.(null, v!);
        }}
        actions={actions}
      />
    </FormControl>
  );
};
