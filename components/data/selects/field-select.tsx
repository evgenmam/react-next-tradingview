import { FormControl, FormLabel, Option, Select, SelectProps } from "@mui/joy";
import { useFields } from "../../../hooks/data.hook";
import * as R from "ramda";
import { SelectDialog } from "../../dialogs/select-dialog";
type Props = {
  exclude?: string[];
  hideLabel?: boolean;
  datasource?: string;
} & SelectProps<string>;

export const FieldSelect = ({
  exclude = [],
  hideLabel,
  datasource = "source",
  ...props
}: Props) => {
  const { fields } = useFields("source");
  const options = R.without(exclude, fields);
  return (
    <FormControl size="sm">
      {!hideLabel && <FormLabel>Data</FormLabel>}
      <SelectDialog
        options={options}
        value={props.value}
        onChange={(v) => {
          props.onChange?.(null, v!);
        }}
      />
    </FormControl>
  );
};
