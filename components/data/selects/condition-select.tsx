import { FormControl, FormLabel, Option, Select, SelectProps } from "@mui/joy";
import { capitalCase } from 'change-case'
export const ConditionSelect = (props: SelectProps<string>) => {
  const options = [
    "crossesUp",
    "crossesDown",
    "equals",
    "greater",
    "less",
    "greaterOrEqual",
    "lessOrEqual",
  ];
  return (
    <FormControl size="sm">
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
