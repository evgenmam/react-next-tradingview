import { FormControl, FormLabel, Input, TextField, useTheme ,} from "@mui/joy";
import { CompactPicker } from "react-color";
import colors from "material-colors";
import * as R from "ramda";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import { ButtonBase, Popover } from "@mui/material";
import { Square2StackIcon, StopIcon } from "@heroicons/react/24/solid";
import randomInteger from "random-int";
import noop from "lodash.noop";

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
type Props = {
  value?: string;
  onChange: (v: string) => void;
  variant?: "input" | "square";
};
export const ColorSelect = ({
  value,
  onChange = noop,
  variant = "input",
}: Props) => {
  const { palette } = useTheme();
  return (
    <PopupState variant="popover" popupId="demo-popup-popover">
      {(popupState) => (
        <>
          {/* {variant === "input" ? (
            <FormControl size="sm">
              <FormLabel>Color</FormLabel>
              <Input
                size="sm"
                {...bindTrigger(popupState)}
                startDecorator={<StopIcon width={20} color={value} />}
                value={value}
              >
                Open Popover
              </Input>
            </FormControl>
          ) : ( */}
            <ButtonBase {...bindTrigger(popupState)}>
              <StopIcon width={20} color={value} />
            </ButtonBase>
          {/* )} */}
          {/* <Popover
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
              styles={{
                default: {
                  compact: { background: palette?.background?.level1 },
                },
              }}
              onChange={(v) => {
                onChange(v.hex);
                popupState.close();
              }}
            />
          </Popover> */}
        </>
      )}
    </PopupState>
  );
};

ColorSelect.swatches = swatches;
ColorSelect.random = () => ColorSelect.swatches[randomInteger(0, 12) * 8];
