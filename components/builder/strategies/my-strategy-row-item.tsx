import {
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import {
  Typography,
  Chip,
  Link,
  Stack,
} from "@mui/joy";
import { useSettings } from "../../../hooks/settings.hook";
import { IStrategy } from "../../../types/app.types";
import { getReversalStrategy } from "../../../utils/strategy.utils";
import { Space } from "../../utils/row";
import { MyStrategyStats } from "./my-strategy-stats";

type MyStrategyRowItemProps = {
  strategy: IStrategy;
  withLink?: boolean;
  reversed?: boolean;
  useTpLs?: boolean;
};

export const MyStrategyRowItem = ({
  strategy,
  withLink,
  reversed,
  useTpLs,
}: MyStrategyRowItemProps) => {
  const c = useSettings();
  const s = reversed ? getReversalStrategy(strategy) : strategy;

  return (
    <Stack spacing={1} alignItems="start">
      <Space s={1} sb>
        <Space s={1} alignItems="center">
          {s?.dataset && (
            <Typography>{c?.[s?.dataset as keyof typeof c]}</Typography>
          )}
          <Chip
            color={s?.direction === "long" ? "success" : "danger"}
            size="sm"
          >
            {s?.direction?.toUpperCase()}
          </Chip>
          {s?.usd ? (
            <Chip size="sm">${s?.usd}</Chip>
          ) : (
            <Chip size="sm">
              {s?.entry} {c[s?.dataset as keyof typeof c]?.split?.(":")[1]}
            </Chip>
          )}{" "}
          {withLink && (
            <Link href={`/strategy?id=${s?.id}`} target="_blank">
              <ArrowTopRightOnSquareIcon width={16} />
            </Link>
          )}
        </Space>
      </Space>

      <MyStrategyStats
        strategy={strategy}
        reversed={reversed}
        useTpLs={useTpLs}
      />
    </Stack>
  );
};

export default MyStrategyRowItem;
