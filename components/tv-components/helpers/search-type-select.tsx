import { RadioGroup, Chip, Radio } from "@mui/joy";
import noop from "lodash.noop";

const format = [
  {
    label: "All",
    key: "",
  },
  {
    label: "Stocks",
    key: "stock",
  },
  {
    label: "Futures",
    key: "future",
  },
  {
    label: "Forex",
    key: "forex",
  },
  {
    label: "Crypto",
    key: "crypto",
  },
  {
    label: "Indices",
    key: "index",
  },
  {
    label: "Bonds",
    key: "bond",
  },
  {
    label: "Economy",
    key: "economic",
  },
] as const;

export type ISearchType = typeof format[number]["key"];

type Props = {
  value: ISearchType;
  onChange?: (value: ISearchType) => void;
};

export const TVSearchTypeSelect = ({ value, onChange = noop }: Props) => {
  return (
    <RadioGroup
      name="best-movie"
      orientation="horizontal"
      aria-labelledby="best-movie"
      sx={{ flexWrap: "wrap", gap: 1 }}
    >
      {format.map((v) => {
        const checked = v.key === value;
        return (
          <Chip
            key={v.key}
            variant={checked ? "soft" : "plain"}
            color={checked ? "primary" : "neutral"}
          >
            <Radio
              variant="outlined"
              color={checked ? "primary" : "neutral"}
              disableIcon
              overlay
              label={v.label}
              value={v.key}
              checked={checked}
              onChange={(event) => {
                if (event.target.checked) {
                  onChange(v.key);
                }
              }}
            />
          </Chip>
        );
      })}
    </RadioGroup>
  );
};
