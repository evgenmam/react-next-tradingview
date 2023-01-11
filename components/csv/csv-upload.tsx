import { Button, Option, Stack, TextField } from "@mui/joy";
import { useRef } from "react";
import { useFields, useRows, useSettings } from "../../hooks/data.hook";
import { IChartData } from "../../types/app.types";
import * as R from "ramda";
import { useModal, useModalAsync } from "../../hooks/modal.hook";

export const CsvUpload = ({
  dataset,
  label = "Add data source",
}: {
  dataset: string;
  label?: string;
}) => {
  const modal = useModalAsync({ label: "Dataset Name" });
  const ref = useRef<HTMLInputElement>(null);
  const { setRows } = useRows("source");
  const { setFields } = useFields();
  const { sett } = useSettings();
  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result;
        try {
          const ds = await modal(
            file.name?.split(".").slice(0, -1).join(".") || file.name
          );
          if (text && typeof text === "string") {
            const lines = text.split("\n");
            const headers = lines[0].split(",").filter((v) => !!v);
            const fields = headers.map((key) => ({
              key,
              isNull: true,
              dataset: ds,
            }));
            const data = lines.slice(1).map((line) => {
              const values = line.split(",");
              return headers.reduce(
                (obj, nextKey, index) => {
                  let value = +values[index];
                  if (nextKey === "time") value *= 1000;
                  if (!isNaN(value)) {
                    fields[index].isNull = false;
                  }
                  return {
                    ...obj,
                    [nextKey]: value,
                  };
                },
                {
                  dataset: ds,
                } as IChartData
              );
            });
            setFields(fields);
            setRows(data);
            sett(dataset)(ds);
          }
        } catch (error) {
          console.log(error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      <Button
        variant="plain"
        onClick={() => {
          ref.current?.click();
        }}
      >
        {label}
      </Button>
      <input
        type="file"
        ref={ref}
        style={{ display: "none" }}
        onChange={onUpload}
      />
    </>
  );
};
