import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  IconButton,
} from "@mui/joy";
import { SelectDialog } from "../dialogs/select-dialog";
import { Stack } from "@mui/system";
import { useState } from "react";
import { useActiveList, useLists } from "../../hooks/data.hook";
import { PlusIcon } from "@heroicons/react/24/outline";
import { TVSymbolSearchDialog } from "../tv-components/dialogs/symbol-search-dialog";
import * as R from "ramda";

type Props = {};

export const SymbolListSelect = ({}: Props) => {
  const [newList, setNewList] = useState("");
  const { list, setActive, addSymbol } = useActiveList();
  const { lists, createList, deleteList } = useLists();
  const onNew = async () => {
    await setActive(await createList(newList));
    setNewList("");
  };
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <Stack direction="row" justifyContent="space-between" p={2}>
      <SelectDialog
        value={list?.name}
        options={lists?.map((l) => l.name)}
        onChange={(l?: string | null) => {
          if (!l) return;
          setActive(lists.find((l2) => l2.name === l)?.id!);
        }}
        onDelete={(l?: string | null) => {
          if (!l) return;
          deleteList(lists.find((l2) => l2.name === l)?.id!);
        }}
        actions={
          <Stack spacing={1}>
            <FormControl>
              <FormLabel>Create List</FormLabel>
              <Input
                value={newList}
                onChange={(e) => setNewList(e.target.value)}
              />
            </FormControl>
            <Button variant="plain" onClick={onNew} disabled={!newList}>
              Save
            </Button>
          </Stack>
        }
      />
      <IconButton>
        <PlusIcon
          width={16}
          onClick={() => {
            setSearchOpen(true);
          }}
        />
      </IconButton>
      <TVSymbolSearchDialog
        open={searchOpen}
        onClose={() => {
          setSearchOpen(false);
        }}
        onSelect={(v) => {
          setSearchOpen(false);
          addSymbol(v);
        }}
      />
    </Stack>
  );
};
