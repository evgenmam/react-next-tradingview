import {
  ChevronDownIcon,
  EyeSlashIcon,
  EyeIcon,
} from "@heroicons/react/24/solid";
import { Box, IconButton, Stack, Typography } from "@mui/joy";
import { ButtonBase, Collapse } from "@mui/material";
import { useHoverGet } from "../../hooks/hover.hook";
import { findClosestIndexByTime } from "../../utils/data.utils";
import { getKeyedStudyData, getStudyFields } from "../../utils/study.utils";
import { ITVStudy } from "../tv-components/types";
import { useV2Study } from "../v2/hooks/v2-data.hook";
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
  const { study: s, updateStudy } = useV2Study(study?.id);
  const isHidden = (key: string) => s?.hiddenFields?.includes(key);
  const toggleField = (key: string) => {
    updateStudy({
      hiddenFields: isHidden(key)
        ? s?.hiddenFields?.filter((f) => f !== key)
        : [...(s?.hiddenFields || []), key],
    });
  };
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center">
        <ButtonBase
          onClick={() => {
            updateStudy({ collapsed: !s?.collapsed });
          }}
          sx={{ mr: 0.5 }}
        >
          <ChevronDownIcon
            width={15}
            style={s?.collapsed ? { transform: "rotate(-90deg)" } : {}}
          />
        </ButtonBase>
        <Typography fontSize={14} fontWeight={600}>
          {study?.meta?.description}
        </Typography>
        <Box ml="auto">
          <IconButton
            onClick={() => {
              updateStudy({ hidden: !study?.hidden });
            }}
            size="sm"
            color={study?.hidden ? "neutral" : "primary"}
          >
            {study?.hidden ? (
              <EyeSlashIcon width={15} />
            ) : (
              <EyeIcon width={15} />
            )}
          </IconButton>
        </Box>
      </Stack>
      <Collapse in={!s?.collapsed}>
        <table>
          <tbody>
            {keys
              .filter((f) => f.title)
              .map((field) => (
                <DisplayDataRow
                  hidden={isHidden(field?.key)}
                  onClick={() => toggleField(field?.key)}
                  key={field?.key}
                  value={data?.[field?.key]}
                  prev={prev?.[field?.key]}
                  field={field.title}
                />
              ))}
          </tbody>
        </table>
      </Collapse>
    </Stack>
  );
};
