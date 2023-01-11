import { FormControl, FormLabel, Option, Select, SelectProps } from "@mui/joy";
import { useDatasets, useSettings } from "../../../hooks/data.hook";
import { Box } from "@mui/system";
type Props = {
  dataset: "source" | "target";
} & SelectProps<string>;

export const DatasetSelect = ({ dataset, ...props }: Props) => {
  const { datasets } = useDatasets();
  const s = useSettings();
  const value = s?.[dataset] || null;
  return (
    <Box>
      <FormControl size="lg">
        <Select
          {...props}
          value={value}
          onChange={(_, e) => {
            s.sett(dataset)(e);
          }}
        >
          {Array.from(datasets).map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
