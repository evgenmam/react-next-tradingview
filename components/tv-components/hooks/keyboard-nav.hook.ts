import { KeyboardEventHandler, useCallback, useRef, useState } from "react";
import * as R from "ramda";
export const useKeyboardNav = ({ max = 0 }) => {
  const [hl, setHl] = useState<number>(-1);

  const listRef = useRef<HTMLUListElement>(null);
  const onKeyDown = useCallback<KeyboardEventHandler<HTMLDivElement>>(
    (e) => {
      let i = hl;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        i = i + 1;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        i = i - 1;
      }
      if (i !== hl) {
        i = R.clamp(-1, max, i);
        setHl(i);
        if (listRef.current) {
          const el = listRef.current.children[i] as HTMLLIElement;
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "nearest" });
          }
        }
      }
    },
    [hl, max]
  );
  return { hl, listRef, onKeyDown, setHl };
};
