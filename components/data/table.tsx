import { Typography } from "@mui/joy";
import { Box } from "@mui/system";
import { useFields, useRows } from "../../hooks/data.hook";
import { filterEmpty } from "../../utils/data.utils";

export const DataTable = () => {
  const { fields } = useFields();
  const { rows } = useRows();
  return (
    <table>
      <thead>
        <tr>
          {fields.map((field) => (
            <th key={field}>
              <Typography fontSize={12} whiteSpace="nowrap" px={0.25}>
                {field}
              </Typography>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i}>
            {fields.map((field) => (
              <td key={field}>
                <Typography fontSize={12} px={0.25}>
                  {row[field]}
                </Typography>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
