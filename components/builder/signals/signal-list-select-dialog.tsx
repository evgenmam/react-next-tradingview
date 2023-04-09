import {
  Modal,
  ModalDialog,
  ModalOverflow,
  List,
  ListItem,
  ListItemButton,
  ModalClose,
  TextField,
  Input,
  ListSubheader,
  Sheet,
  IconButton,
} from "@mui/joy";
import { useV2Studies } from "../../v2/hooks/v2-data.hook";
import {
  SFT,
  getKeyedStudyData,
  getStudyFields,
} from "../../../utils/study.utils";
import { Box, Collapse, Divider, Fade, Stack } from "@mui/material";
import { useCallback, useState } from "react";
import { Space } from "../../utils/row";
import { TransitionGroup } from "react-transition-group";
import { ITVStudy } from "../../tv-components/types";
import * as R from "ramda";
import { ICondition, IConditionEntry } from "../../../types/app.types";
import { CheckIcon } from "@heroicons/react/24/solid";
import { ColorSelect } from "../../data/selects/color-select";

type SignalListSelectDialogProps = {
  onChange?: (a: SFT, condition?: IConditionEntry) => void;
  open?: boolean;
  withNumber?: boolean;
  onClose?: () => void;
};

export const SignalListSelectDialog = ({
  open,
  onChange,
  onClose,
  withNumber,
}: SignalListSelectDialogProps) => {
  const { studies } = useV2Studies();
  const [search, setSearch] = useState("");
  const [value, setValue] = useState(0);

  const matchSearch = useCallback(
    (s: string) => s.match(new RegExp(`${search}`, "i")),
    [search]
  );

  const fff = useCallback(
    (study: ITVStudy) => {
      const fields = getStudyFields(study).filter(
        (v) => !v.styles?.isHidden && v.title
      );
      return !!search
        ? fields
            .sort((a, b) =>
              matchSearch(a.title) ? -1 : matchSearch(b.title) ? 1 : 0
            )
            .sort(
              (a, b) =>
                (matchSearch(a.title)?.index ?? 100) -
                (matchSearch(b.title)?.index ?? 100)
            )
        : fields.sort((a, b) => a.title.localeCompare(b.title));
    },
    [search, matchSearch]
  );

  return (
    <Modal open={!!open} onClose={onClose}>
      <ModalOverflow>
        <ModalDialog>
          <Stack spacing={2} divider={<Divider />}>
            <Space
              s={2}
              position="sticky"
              top="0"
              zIndex="10"
              sx={{ backdropFilter: "blur(10px)" }}
              divider={<Divider orientation="vertical" />}
            >
              <Input
                autoFocus
                sx={{ flexGrow: 1 }}
                variant="soft"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search..."
              />
              {withNumber && (
                <Input
                  variant="soft"
                  value={value || ""}
                  onChange={(e) => {
                    setValue(Number(e.target.value));
                  }}
                  placeholder="Static value"
                  endDecorator={
                    <IconButton
                      disabled={!value}
                      size="sm"
                      variant="plain"
                      onClick={() => {
                        onChange?.({} as SFT, {
                          value,
                          type: "number",
                          offset: 0,
                        });
                        onClose?.();
                      }}
                    >
                      <CheckIcon width={24} />
                    </IconButton>
                  }
                />
              )}
            </Space>
            <Space gap={2} flexWrap="wrap">
              {studies?.map((s) => (
                <List key={s.id} size="sm">
                  <ListSubheader>{s.meta.description}</ListSubheader>
                  {fff(s).map((f) => (
                    <ListItem key={f.key}>
                      <ListItemButton
                        onClick={() =>
                          onChange?.(f, {
                            field: `${f.study}:${f.title}----${f.key}`,
                            type: "field",
                            offset: 0,
                          })
                        }
                        disabled={!matchSearch(f.title)?.length}
                        dangerouslySetInnerHTML={{
                          __html: search
                            ? f.title
                                .replaceAll(" ", "&nbsp;")
                                .replace(
                                  new RegExp(`(${search})`, "i"),
                                  `<u><strong>$1</strong></u>`
                                )
                            : f.title,
                        }}
                      ></ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ))}
            </Space>
          </Stack>
        </ModalDialog>
      </ModalOverflow>
    </Modal>
  );
};

export default SignalListSelectDialog;
