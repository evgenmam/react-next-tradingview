import { Stack, Typography } from "@mui/joy";
import { useHoverGet } from "../../hooks/hover.hook";
import { findClosestIndexByTime } from "../../utils/data.utils";
import { getKeyedStudyData, getStudyFields } from "../../utils/study.utils";
import { ITVStudy } from "../tv-components/types";
import { DisplayDataRow } from "./display-data-row";

type Props = {
  study: ITVStudy;
};
export const DisplayDataStudy = ({ study }: Props) => {
  const hover = useHoverGet();
  const idx = findClosestIndexByTime(hover)(
    study?.data?.st?.map(({ v }) => ({ time: v[0] }))
  );

  const keys = getStudyFields(study).filter((v) => v);
  const data = getKeyedStudyData(study)[idx];
  const prev = getKeyedStudyData(study)[idx - 1];
  return (
    <Stack spacing={1}>
      <Typography fontSize={14} fontWeight={600}>
        {study?.meta?.description}
      </Typography>
      <table>
        <tbody>
          {keys
            .filter((f) => f.title)
            .map((field) => (
              <DisplayDataRow
                key={field?.key}
                value={data?.[field?.key]}
                prev={prev?.[field?.key]}
                field={field.title}
              />
            ))}
        </tbody>
      </table>
    </Stack>
  );
};
