import {
  FormControl,
  FormLabel,
  Option,
  Select,
  SelectProps,
  Stack,
  Typography,
} from "@mui/joy";
import { useFields, useSignals } from "../../../hooks/data.hook";
import * as R from "ramda";
import { StopIcon } from "@heroicons/react/24/solid";
import { sentenceCase } from "change-case";
import { useState } from "react";
import { ISignal } from "../../../types/app.types";
type Props = {
  exclude?: string[];
  hideLabel?: boolean;
  datasource?: string;
  label?: string;
} & SelectProps<ISignal>;

export const SignalSelect = ({
  exclude = [],
  hideLabel,
  label = "Signal",
  ...props
}: Props) => {
  const { signals } = useSignals();

  const options = R.without(exclude, signals);
  return (
    <FormControl size="sm">
      {!hideLabel && <FormLabel>{label}</FormLabel>}
      <Select {...props}>
        {options.map((option) => (
          <Option key={option.id} value={option}>
            <Stack direction={"row"} spacing={0.5}>
              <StopIcon color={option.color} width={18} />

              <Stack>
                {option.condition.map((c) => (
                  <Stack direction="row" key={JSON.stringify(c)} spacing={0.5}>
                    <Typography fontSize={12}>
                      {c.a.field}[{c.a.offset}]
                    </Typography>
                    <Typography fontSize={12}>
                      {sentenceCase(c.operator)}
                    </Typography>
                    <Typography fontSize={12}>
                      {c.b?.field}[{c.b?.offset}]
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Option>
        ))}
      </Select>
    </FormControl>
  );
};
