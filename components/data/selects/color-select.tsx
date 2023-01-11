import { FormControl, FormLabel, Input, TextField } from "@mui/joy";
import { CompactPicker } from "react-color";
import colors from "material-colors";
import * as R from "ramda";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { Popover } from "@mui/material";
import { Square2StackIcon, StopIcon } from "@heroicons/react/24/solid";
import randomInteger from "random-int";

const swatches = R.pipe(
  R.pick([
    "red",
    "pink",
    "purple",
    "deepPurple",
    "indigo",
    "blue",
    "lightBlue",
    "cyan",
    "teal",
    "green",
    "lightGreen",
    "amber",
  ]),
  R.values,
  // @ts-ignore
  (v) => R.range(2, 9).map((i) => v.map((v) => v[i * 100])),
  R.flatten
)(colors);

export const ColorSelect = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: string) => void;
}) => {
  return (
    <FormControl size="sm">
      <FormLabel>Color</FormLabel>
      <PopupState variant="popover" popupId="demo-popup-popover">
        {(popupState) => (
          <div>
            <TextField
              size="sm"
              {...bindTrigger(popupState)}
              startDecorator={<StopIcon width={20} color={value} />}
              value={value}
            >
              Open Popover
            </TextField>
            <Popover
              {...bindPopover(popupState)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
            >
              <CompactPicker
                colors={swatches}
                onChange={(v) => {
                  onChange(v.hex);
                  popupState.close();
                }}
              />
            </Popover>
          </div>
        )}
      </PopupState>
    </FormControl>
  );
};

ColorSelect.swatches = swatches;
ColorSelect.random = () => ColorSelect.swatches[randomInteger(0, 12) * 8];
