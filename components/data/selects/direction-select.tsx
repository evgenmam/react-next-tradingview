import { FormControl, FormLabel, Option, Select, SelectProps } from "@mui/joy";
import { capitalCase } from "change-case";
export const DirectionSelect = (props: SelectProps<"long" | "short">) => {
  const options = ["long", "short"];
  return (
    <FormControl size="sm">
      <FormLabel htmlFor="direction">Direction</FormLabel>
      <Select {...props}>
        {options.map((option) => (
          <Option key={option} value={option}>
            {capitalCase(option)}
          </Option>
        ))}
      </Select>
    </FormControl>
  );
};
