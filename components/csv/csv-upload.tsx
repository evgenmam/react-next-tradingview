import { Button, Stack, TextField } from "@mui/joy";
import { useRef } from "react";
import { useFields, useRows } from "../../hooks/data.hook";
import { IChartData } from "../../types/app.types";
import * as R from "ramda";

export const CsvUpload = () => {
  const ref = useRef<HTMLInputElement>(null);
  const { setRows } = useRows();
  const { setFields } = useFields();
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (text && typeof text === "string") {
          const lines = text.split("\n");
          const headers = lines[0].split(",").filter((v) => !!v);
          const fields = headers.map((key) => ({ key, isNull: true }));
          const data = lines.slice(1).map((line) => {
            const values = line.split(",");
            return headers.reduce((obj, nextKey, index) => {
              let value = +values[index];
              if (nextKey === "time") value *= 1000;
              if (!isNaN(value)) {
                fields[index].isNull = false;
              }
              return {
                ...obj,
                [nextKey]: value,
              };
            }, {} as IChartData);
          });
          setFields(fields);
          setRows(data);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Stack>
      <Button
        onClick={() => {
          ref.current?.click();
        }}
      >
        Upload Csv
      </Button>
      <input
        type="file"
        ref={ref}
        style={{ display: "none" }}
        onChange={onUpload}
      />
    </Stack>
  );
};
