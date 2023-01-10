import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Sheet,
  Typography,
} from "@mui/joy";
import { Stack } from "@mui/system";
import { IIndicator, IIndicatorField } from "../../types/app.types";
import { XMarkIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { ButtonBase, Collapse, TextField, useTheme } from "@mui/material";
import { useIndicators } from "../../hooks/data.hook";
import { useState } from "react";
import { FieldSelect } from "./selects/field-select";
import { TypeSelect } from "./selects/type-select";
import * as R from "ramda";
type Props = {
  indicator: IIndicator;
};

export const IndicatorTable = ({ indicator }: Props) => {
  const { removeIndicator, updateIndicator } = useIndicators();
  const [adding, setAdding] = useState(false);
  const [field, setField] = useState<IIndicatorField>({
    key: "close",
    type: "line",
  });
  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={0.3}>
          <Typography fontSize={15}>{indicator.name}</Typography>
          <ButtonBase
            onClick={() => {
              removeIndicator(indicator.name);
            }}
          >
            <Typography color="danger">
              <TrashIcon width={12} />
            </Typography>
          </ButtonBase>
        </Stack>
        <Stack direction="row" spacing={0.5}>
          <ButtonBase
            onClick={() => {
              setAdding(!adding);
            }}
          >
            {adding ? <XMarkIcon width={15} /> : <PlusIcon width={15} />}
          </ButtonBase>
        </Stack>
      </Stack>
      <Stack>
        {indicator.fields.map((field) => (
          <Stack
            key={field.key}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0.5}
          >
            <Typography fontSize={12}>{field.key}</Typography>
            <ButtonBase
              onClick={() => {
                updateIndicator(
                  R.over(
                    R.lensProp<IIndicator, "fields">("fields"),
                    R.reject(R.propEq("key", field.key))
                  )(indicator)
                );
              }}
            >
              <Typography color="danger">
                <TrashIcon width={12} />
              </Typography>
            </ButtonBase>
          </Stack>
        ))}
      </Stack>
      <Collapse in={adding}>
        <Sheet variant="outlined" sx={{ p: 1, borderRadius: 4 }}>
          <Stack spacing={1}>
            <FieldSelect
              value={field.key}
              onChange={(_, v) => {
                if (v) setField(R.assoc("key", v));
              }}
              exclude={indicator.fields.map((f) => f.key)}
            />
            <TypeSelect
              onChange={(_, v) => {
                if (v) setField(R.assoc("type", v as IIndicatorField["type"]));
              }}
              value={field.type}
            />
            <Button
              size="sm"
              variant="plain"
              onClick={() => {
                updateIndicator(
                  R.over(
                    R.lensProp<IIndicator, "fields">("fields"),
                    R.append(field)
                  )(indicator)
                );
                setField({
                  key: "close",
                  type: "line",
                });
                setAdding(false);
              }}
            >
              Save
            </Button>
          </Stack>
        </Sheet>
      </Collapse>
    </Stack>
  );
};
