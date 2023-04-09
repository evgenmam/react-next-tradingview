import { SelectChangeEvent } from "@mui/material";
import axios from "axios";
import noop from "lodash.noop";
import {
  KeyboardEvent,
  useEffect,
  useState,
  ChangeEvent,
  ReactEventHandler,
} from "react";
import { useDebounce } from "use-debounce";
import * as R from "ramda";

export function useSearchData<T>({
  // query = "",
  onResult = noop,
  params,
  url,
  skip,
}: {
  url: string;
  skip?: boolean;
  params?: Record<string, any>;
  query?: string;
  onResult?: (d: T) => void;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const query = JSON.stringify(params);
  const [q] = useDebounce(query, 300, { leading: false, trailing: true });

  useEffect(() => {
    const getR = async () => {
      if (!skip) {
        const params = JSON.parse(q);
        try {
          setLoading(true);
          const { data } = await axios.get<T>(url, {
            params,
          });
          onResult(data);
        } finally {
          setLoading(false);
        }
      }
    };
    getR();
  }, [q, url, skip, onResult]);

  return { loading, setLoading };
}

export const useSplitText = (separator: string | RegExp) => {
  const [text, setText] = useState<string>("");
  const [cursor, setCursor] = useState<number>(0);
  const spl = text.split(separator);
  const splitIdx = spl.findIndex(
    (_, i, v) => v.slice(0, i + 1).join("").length >= cursor - i
  );

  const splitText = spl[splitIdx];

  const onTextChange = (
    e: ChangeEvent<HTMLInputElement> & KeyboardEvent<HTMLInputElement>
  ) => {
    setText(e.target.value?.toUpperCase() ?? "");
  };
  const onCursorChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCursor(e.target.selectionStart ?? 0);
  };

  const setSplitText = (newText: string) => {
    setText(
      R.pipe(
        R.over(R.lensIndex(splitIdx), R.always(newText)),
        R.join(text.match(separator)?.[0] || "")
      )(spl)
    );
  };
  return {
    text,
    setText,
    onTextChange,
    onCursorChange,
    splitIdx,
    splitText,
    setSplitText,
  };
};
