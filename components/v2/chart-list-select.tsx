import { IChartConfig } from "./v2.types";
import { useV2Chart, useV2List } from "./hooks/v2-data.hook";
import { SelectDialog } from "../dialogs/select-dialog";
import { useLists } from "../../hooks/data.hook";
import { Button, FormControl, FormLabel, Input, Stack } from "@mui/joy";
import { useState } from "react";
import { XJson } from "../json";

type Props = {
  config: IChartConfig;
};
export const V2ChartListSelect = ({ config }: Props) => {
  const [newList, setNewList] = useState<string>("");
  const { list } = useV2List(config?.list);
  const { setList } = useV2Chart(config);
  const { lists, createList, deleteList } = useLists();
  const onNew = async () => {
    await setList(await createList(newList));
    setNewList("");
  };
  return (
    <SelectDialog
      value={list?.name}
      options={lists?.map((l) => l.name)}
      onChange={(l?: string | null) => {
        setList((lists.find((l2) => l2.name === l) || lists[0])?.id!);
      }}
      onDelete={(l?: string | null) => {
        deleteList(lists.find((l2) => l2.name === l)?.id!);
      }}
      actions={
        <Stack spacing={1}>
          <Input
            value={newList}
            onChange={(e) => setNewList(e.target.value)}
            placeholder="Create new list"
          />
          <Button variant="plain" onClick={onNew} disabled={!newList}>
            Save
          </Button>
        </Stack>
      }
    />
  );
};
