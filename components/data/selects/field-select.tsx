import { FormControl, FormLabel, Option, Select, SelectProps } from "@mui/joy";
import { useFields } from "../../../hooks/data.hook";
import * as R from "ramda";
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
      <Select {...props}>
        {options.map((option) => (
          <Option key={option} value={option}>
            {option}
          </Option>
        ))}
      </Select>
    </FormControl>
  );
};
