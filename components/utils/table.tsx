import { FC } from "react";
import * as R from "ramda";
import { Stack } from "@mui/system";
import { XJson } from "../json";
import { Box, Typography } from "@mui/joy";
import { cur, per } from "../../utils/number.utils";
export type XTableCol = {
  key: string;
  label: string;
  group?: string;
  render?: (col: any, row: any) => JSX.Element | string;
  align?: "left" | "right" | "center";
  cur?: boolean;
  per?: boolean;
  dynamic?: boolean;
  thin?: boolean;
};
export type XTableConfig = {
  cols: XTableCol[];
  data: any[];
  debug?: boolean;
};

const XTableHead = ({ cols }: { cols: XTableCol[] }) => {
  return (
    <>
      {cols.map((col, idx) => (
        <Box
          sx={{
            gridColumnStart: idx + 1,
            gridColumnEnd: idx + 2,
            gridRowStart: 1,
            gridRowEnd: 2,
            textAlign: col.align || "left",
          }}
          key={col.key}
        >
          <Typography fontSize={12} level="body2">
            {col.label}
          </Typography>
        </Box>
      ))}
    </>
  );
};

const XTableBody = ({ cols, data }: XTableConfig) => {
  return (
    <>
      {data.map((row, i) =>
        cols.map((col, j) => {
          const value = R.pathOr("", col.key?.split("."))(row);
          const r = col?.render?.(value, row);

          return (
            <Box
              key={col.key}
              sx={{
                gridColumnStart: j + 1,
                gridColumnEnd: j + 2,
                gridRowStart: i + 2,
                gridRowEnd: i + 3,
                textAlign: col.align || "left",
              }}
            >
              {r ? (
                typeof r === "string" ? (
                  <Typography>{r}</Typography>
                ) : (
                  r
                )
              ) : (
                <Typography
                  fontSize={12}
                  color={
                    !col.dynamic
                      ? "primary"
                      : typeof value === "number"
                      ? value > 0
                        ? "success"
                        : "danger"
                      : value[0] === "-"
                      ? "danger"
                      : +value.replace(/%|\$/, "") === 0
                      ? "primary"
                      : "success"
                  }
                >
                  {typeof value === "number"
                    ? col?.cur
                      ? cur(value)
                      : col?.per
                      ? per(value)
                      : value
                    : value || "-"}
                </Typography>
              )}
            </Box>
          );
        })
      )}
    </>
  );
};

export const XTable: FC<XTableConfig> = ({
  cols,
  data,
  debug,
}: XTableConfig) => {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: cols
          .map((c) => (c.thin ? "max-content" : "auto"))
          .join(" "),
      }}
    >
      <XTableHead cols={cols} />
      <XTableBody {...{ cols, data }} />
    </Box>
  );
};
