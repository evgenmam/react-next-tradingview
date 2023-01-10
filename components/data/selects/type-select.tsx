import { FormControl, FormLabel, Option, Select, SelectProps } from "@mui/joy";

export const TypeSelect = (props: SelectProps<string>) => {
  const options = [
    "line",
    "area",
    "bar",
    // "histogram",
    // "pie",
    // "donut",
    // "radialBar",
    "scatter",
    // "bubble",
    // "heatmap",
    // "treemap",
    // "boxPlot",
    // "candlestick",
    // "radar",
    // "polarArea",
    // "rangeBar",
  ];
  return (
    <FormControl size="sm">
      <FormLabel>Chart Type</FormLabel>
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
