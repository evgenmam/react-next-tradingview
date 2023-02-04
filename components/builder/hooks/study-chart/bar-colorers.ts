import { useMemo } from "react";
import { ITVStudy, ITVStudyConfig } from "../../../tv-components/types";
import { useActiveStudies } from "../../../v2/hooks/v2-data.hook";
import * as R from "ramda";
import { CLOSING } from "ws";
import { studyToBarColorers } from "../../utils/builder.utils";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
export type ITVBarColorer = {
  color: string;
  value: number;
  id: string;
  label: string;
  title: string;
  name: string;
  hidden?: boolean;
};
export const useBarColorers = (
  study?: ITVStudy,
  config?: ITVStudyConfig
): ITVBarColorer[] => {
  const { studies } = useActiveStudies();
  const colorers = useMemo(
    () =>
      studies
        ?.filter((s) => !s?.config?.hidden)
        ?.flatMap((v) => studyToBarColorers(v, v?.config)),
    [studies]
  );

  return colorers;
};
