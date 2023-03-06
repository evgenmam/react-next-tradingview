import { queryTypes, useQueryState } from "next-usequerystate";
import {
  ForwardedRef,
  forwardRef,
  Fragment,
  memo,
  useImperativeHandle,
  useRef,
} from "react";
import { useCompareRows, useStrategies } from "../../../hooks/data.hook";
import { getReversalStrategy } from "../../../utils/strategy.utils";
import { ITVSymbol } from "../../tv-components/types";
import { getSymbolKey } from "../../tv-components/utils/symbol.utils";
import { useSignalEvents } from "../hooks/signal-events";
import { useStrategyDetails } from "../hooks/strategy-details";
import { ISStats } from "../hooks/strategy-stats";
import CompareListItemRow from "./compare-list-item-row";

type CompareListItemProps = {
  num: ITVSymbol;
  den: ITVSymbol;
};

export const CompareListItem = forwardRef(function CompareListItem(
  { num, den }: CompareListItemProps,
  ref: ForwardedRef<ISStats[]>
) {
  const n = getSymbolKey(num);
  const d = getSymbolKey(den);
  const [nums = [], dens = [], divs = []] = useCompareRows(n, d) || [];
  const [id] = useQueryState("id", queryTypes.integer.withDefault(0));
  const { strategy } = useStrategyDetails({ id });
  const rStrat = getReversalStrategy(strategy);
  const { reverse } = useStrategies();
  const events = useSignalEvents(strategy, divs);

  return (
    <Fragment>
      <CompareListItemRow
        target={nums}
        events={events}
        strategy={strategy}
        pair={`${n}/${d}`}
        symbol={n}
      />
      {reverse && (
        <CompareListItemRow
          target={dens}
          events={events}
          strategy={rStrat}
          pair={`${n}/${d}`}
          symbol={d}
        />
      )}
    </Fragment>
  );
});

export default memo(CompareListItem);
