import axios from "axios";
import fs from "fs";
import client from "ws";
import { ITVIndicator } from "../components/tv-components/types";
import { ColorTool } from "../utils/color.utils";
import { TVTranslateResponse } from "./types";

class TVApiC {
  login = async () => {
    const headers = new Headers();
    headers.append("Referer", "https://www.tradingview.com/");

    const body = new URLSearchParams();
    body.append("username", process.env.TV_EMAIL!);
    body.append("password", process.env.TV_PASSWORD!);
    body.append("remember", "on");

    const response = await fetch(
      "https://www.tradingview.com/accounts/signin/",
      {
        method: "post",
        headers,
        body,
      }
    );
    const r = await response.json();
    fs.writeFileSync("res.json", JSON.stringify(r, null, 2));
    return r;
  };

  getAuthToken = async () => {
    const res = await this.login();
    return res.auth_token;
  };

  search = async (query: {
    text: string;
    exchange?: string;
    type?: string;
  }) => {
    try {
      const { data } = await axios.get(
        "https://symbol-search.tradingview.com/s/",
        {
          params: {
            ...query,
            lang: "en",
            domain: "production",
          },
        }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  searchIndicators = async (search: string) => {
    const { data } = await axios.get(
      "https://www.tradingview.com/pubscripts-suggest-json",
      { params: { search } }
    );
    return data;
  };

  translateIndicator = async (
    indicator: ITVIndicator
  ): Promise<TVTranslateResponse> => {
    const { data } = await axios.get(
      "https://pine-facade.tradingview.com/pine-facade/translate/" +
        indicator.scriptIdPart +
        "/" +
        indicator.version,
      {
        headers: {
          referer: "https://www.tradingview.com/",
        },
      }
    );
    return data;
  };
}

const TVApi = new TVApiC();

export default TVApi;
