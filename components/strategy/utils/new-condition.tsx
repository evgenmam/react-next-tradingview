import { Box, Grid, Input } from "@mui/joy";
import { Stack } from "@mui/system";
import { ICondition } from "../../../types/app.types";
import { ConditionSelect } from "../../data/selects/condition-select";
import { FieldSelect } from "../../data/selects/field-select";

type Props = {
  first?: boolean;
  value: ICondition;
  setCondition: (c: ICondition) => void;
  onDelete?: () => void;
};
export const NewCondition = ({ first, value, setCondition }: Props) => {
  const setC = (key: keyof ICondition) => (v: any) => {
    setCondition({ ...value, [key]: v });
  };
  return (
    <Stack spacing={1}>
      <Stack direction="row">
        <Box flexGrow={1}>
          <FieldSelect
            exclude={["time", "id", "dataset"]}
            hideLabel
            value={value.a.field}
            onChange={(_, e) => {
              e && setC("a")({ ...value.a, field: e });
            }}
          />
        </Box>
        <Box flexShrink={1}>
          <Input
            type="number"
            size="sm"
            fullWidth={false}
            sx={{ width: 55 }}
            value={value.a.offset}
            onChange={(e) => {
              if (+e.target.value <= 0) {
                setC("a")({ ...value.a, offset: +e.target.value });
              }
            }}
          />
        </Box>
      </Stack>
      <ConditionSelect
        value={value.operator}
        onChange={(_, e) => {
          e && setC("operator")(e);
        }}
      />
      {value?.operator !== "true" && (
        <Stack direction="row">
          <Box flexGrow={1}>
            <FieldSelect
              exclude={["time", "id", "dataset"]}
              hideLabel
              value={value?.b?.field}
              onChange={(_, e) => {
                e && setC("b")({ ...value.b, field: e });
              }}
            />
          </Box>
          <Box flexShrink={1}>
            <Input
              type="number"
              size="sm"
              fullWidth={false}
              sx={{ width: 55 }}
              value={value?.b?.offset}
              onChange={(e) => {
                if (+e.target.value <= 0) {
                  setC("b")({ ...value.b, offset: +e.target.value });
                }
              }}
            />
          </Box>
        </Stack>
      )}
    </Stack>
  );
};
