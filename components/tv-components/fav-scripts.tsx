import { Button, CircularProgress, List } from "@mui/joy";
import { Stack } from "@mui/system";
import axios from "axios";
import noop from "lodash.noop";
import { useCallback, useEffect, useState } from "react";
import { XJson } from "../json";
import { useV2PrivateScripts } from "../v2/hooks/v2-data.hook";
import { TVScriptListRow } from "./script-list-row";
import { ITVIndicator } from "./types";

type Props = {
  onSelect: (i: ITVIndicator) => void;
};
export const TVFavScripts = ({ onSelect = noop }: Props) => {
  const [loading, setLoading] = useState(false);
  const { privateScripts, setPrivateScripts } = useV2PrivateScripts();
  const getScripts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get<ITVIndicator[]>(
        "/api/indicators/private"
      );
      setLoading(false);
      setPrivateScripts(data);
    } catch (error) {}
  }, [setPrivateScripts]);
  useEffect(() => {
    const getS = async () => {
      if (privateScripts && privateScripts.length === 0) {
        await getScripts();
      }
    };
    getS();
  }, []);
  return loading ? (
    <CircularProgress />
  ) : (
    <Stack spacing={1}>
      <List>
        {privateScripts.map((item) => (
          <TVScriptListRow
            onClick={onSelect}
            script={item}
            key={item.scriptIdPart}
          ></TVScriptListRow>
        ))}
      </List>
      <Button variant="plain" onClick={getScripts}>
        Refresh
      </Button>
    </Stack>
  );
};
