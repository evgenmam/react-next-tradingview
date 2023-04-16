import {
  Autocomplete,
  CircularProgress,
  FormControl,
  FormLabel,
  Option,
} from "@mui/joy";
import axios from "axios";
import noop from "lodash.noop";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { ITVIndicator } from "./types";

type Props = { onSelect?: (value: ITVIndicator) => void };

export const TVIndicatorSearch = ({ onSelect = noop }: Props) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<ITVIndicator[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [debounced] = useDebounce(search, 300, {
    trailing: true,
    leading: false,
  });

  useEffect(() => {
    (async () => {
      if (debounced) {
        setLoading(true);
        const { data } = await axios.get("/api/indicators/search", {
          params: { search: debounced },
        });
        setOptions(data?.results);
      } else {
        setOptions([]);
      }
      setLoading(false);
    })();
  }, [debounced]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);
  return (
    <FormControl>
      <Autocomplete
        sx={{ width: 300 }}
        placeholder="Search indicators"
        value={null}
        onChange={(_, v) => {
          if (v) onSelect(v);
          setSearch("");
        }}
        open={open}
        onOpen={() => {
          setSearch("");
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        inputValue={search}
        onInputChange={(event, newValue) => {
          setSearch(newValue);
        }}
        isOptionEqualToValue={(option, value) =>
          option.scriptIdPart === value.scriptIdPart
        }
        getOptionLabel={(option) => option.scriptName}
        options={options}
        loading={loading}
        slotProps={{
          listbox: {
            disablePortal: true,
          },
        }}
        endDecorator={
          loading ? (
            <CircularProgress
              size="sm"
              sx={{ bgcolor: "background.surface" }}
            />
          ) : null
        }
      />
    </FormControl>
  );
};
