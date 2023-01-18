import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Sheet,
  Textarea,
  Typography,
} from "@mui/joy";
import { Stack } from "@mui/system";
import { IIndicator, IIndicatorField } from "../../types/app.types";
import {
  XMarkIcon,
  PlusIcon,
  TrashIcon,
  StopIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";
import { ButtonBase, Collapse, TextField, useTheme } from "@mui/material";
import { useFields, useIndicators } from "../../hooks/data.hook";
import { useState } from "react";
import { FieldSelect } from "./selects/field-select";
import { TypeSelect } from "./selects/type-select";
import * as R from "ramda";
import { ColorSelect } from "./selects/color-select";
import randomInteger from "random-int";
type Props = {
  indicator: IIndicator;
};

export const IndicatorTable = ({ indicator }: Props) => {
  const { removeIndicator, updateIndicator } = useIndicators();
  const { fields } = useFields();
  const [adding, setAdding] = useState(false);
  const [field, setField] = useState<IIndicatorField>({
    key: "close",
    type: "line",
    color: ColorSelect.random(),
  });
  const [json, setJson] = useState("{}");
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
              if (!adding) {
                setField({
                  key: "close",
                  type: "line",
                  color: ColorSelect.random(),
                });
                setJson("{}");
              }
              setAdding(!adding);
            }}
          >
            {adding ? <XMarkIcon width={15} /> : <PlusIcon width={15} />}
          </ButtonBase>
        </Stack>
      </Stack>
      <Stack>
        {indicator.fields.map((field, idx) => (
          <Stack
            key={field.key}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0.5}
          >
            <Stack
              spacing={0.5}
              direction="row"
              sx={{ opacity: fields.includes(field.key) ? 1 : 0.3 }}
            >
              <StopIcon width={18} color={field?.color} />
              <Typography fontSize={12}>{field.key}</Typography>
            </Stack>
            <Stack
              spacing={0.5}
              direction="row"
              sx={{ opacity: fields.includes(field.key) ? 1 : 0.3 }}
            >
              <ButtonBase
                onClick={() => {
                  updateIndicator(
                    R.over(
                      R.lensPath(["fields", idx, "hide"]),
                      R.not
                    )(indicator)
                  );
                }}
              >
                {field?.hide ? (
                  <Typography color="neutral">
                    <EyeSlashIcon width={12} />
                  </Typography>
                ) : (
                  <Typography color="info">
                    <EyeIcon width={12} />
                  </Typography>
                )}
              </ButtonBase>
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
            <ColorSelect
              onChange={(v) => {
                if (v) setField(R.assoc("color", v));
              }}
              value={field.color}
            />
            <Textarea
              minRows={2}
              value={json}
              onChange={(v) => setJson(v.target.value)}
            />
            <Button
              size="sm"
              variant="plain"
              onClick={() => {
                try {
                  const props = JSON.parse(json);
                  setField(R.assoc("props", props));
                } catch (error) {}
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
