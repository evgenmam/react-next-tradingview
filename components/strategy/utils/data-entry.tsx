import { Option, Select, Stack } from "@mui/joy";
import { useState } from "react";
import { IConditionEntry } from "../../../types/app.types";
import * as R from "ramda";
import { FieldSelect } from "../../data/selects/field-select";
import { TextField } from "@mui/material";

type Props = {
  value: IConditionEntry;
  setValue: (v: IConditionEntry) => void;
};

export const DataEntry = ({ value, setValue }: Props) => {
  const [data, setData] = useState<IConditionEntry>({
    type: "field",
  });
  const setF = (key: keyof IConditionEntry) => (value: any) => {
    setData(R.assoc(key, value));
  };
  return (
    <Stack direction="row">
      <FieldSelect value={data.field} onChange={setF("field")} />
    </Stack>
  );
};
