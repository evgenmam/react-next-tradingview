import { Checkbox, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import { useFields, useIndicators, useRows } from "../../hooks/data.hook";
import { useHoverGet } from "../../hooks/hover.hook";
import { findClosestIndexByTime } from "../../utils/data.utils";
import { DisplayDataRow } from "./display-data-row";

type Props = {
  dataset: string;
};

const exclude = ["time", "id", "dataset"];
const include = ["open", "close", "high", "low"];

export const DisplayDataTable = ({ dataset }: Props) => {
  const { fields } = useFields(dataset);
  const { dataset: ds, rows } = useRows(dataset);
  const { indicators } = useIndicators();
  const [show, setShow] = useState(false);
  const hover = useHoverGet();
  const idx = findClosestIndexByTime(hover)(rows);
  const data = rows?.[idx];
  const prev = rows?.[idx - 1];
  const filtered = fields.filter(
    (v) =>
      (!exclude.includes(v) &&
        (indicators.some((i) => i.fields.some((f) => f.key === v)) || show)) ||
      include.includes(v)
  );
  return (
    <Stack spacing={1}>
      <Typography fontSize={14} fontWeight={600}>
        {ds}
      </Typography>
      <table>
        <tbody>
          {(dataset === "source" ? filtered : include).map((field) => (
            <DisplayDataRow
              key={field}
              value={data?.[field]}
              prev={prev?.[field]}
              field={field}
            />
          ))}
        </tbody>
      </table>
      {dataset === "source" && (
        <Checkbox
          size="sm"
          label="Show inactive"
          checked={show}
          onChange={() => setShow(!show)}
        />
      )}
    </Stack>
  );
};
