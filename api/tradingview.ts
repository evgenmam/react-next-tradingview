import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import client from "ws";
import { ITVIndicator } from "../components/tv-components/types";
import { ColorTool } from "../utils/color.utils";
import { TVTranslateResponse } from "./types";

class TVApiC {
  l = async () => {
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
    return response;
  };
  login = async () => {
    const response = await this.l();
    return response.json();
  };

  getAuthToken = async () => {
    const res = await this.login();
    return res.auth_token;
  };

  getAuthCookie = async () => {
    const res = await this.l();
    const h = res.headers.get("set-cookie");
    if (h) {
      return h
        ?.split("; ")
        ?.filter((c) => c.startsWith("Secure, "))
        ?.map((v) => v.replace("Secure, ", ""))
        ?.join("; ");
    }
    return;
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

  getPrivateScripts = async () => {
    const cookie = await this.getAuthCookie();
    const cfg = { headers: { cookie, origin: "https://www.tradingview.com" } };

    const { data: scripts } = await axios.post(
      "https://www.tradingview.com/pine_perm/list_scripts/",
      {},
      cfg
    );
    const fd = new FormData();
    fd.append("scriptIdPart", scripts.join(","));
    const { data } = await axios.post(
      "https://www.tradingview.com/pubscripts-get/",
      fd,
      cfg
    );
    return data;
  };

  postStrategy = async (script: string, name?: string, toDelete?: string) => {
    const cookie = await this.getAuthCookie();
    const cfg = { headers: { cookie, origin: "https://www.tradingview.com" } };
    const body = new FormData();
    if (toDelete) {
      try {
        await axios.post(
          ` https://pine-facade.tradingview.com/pine-facade/delete/${toDelete}`,
          cfg
        );
      } catch {}
    }
    body.append("source", script);
    const { data } = await axios.post(
      `https://pine-facade.tradingview.com/pine-facade/save/new/?name=${name}`,
      body,
      { ...cfg, params: { name, allow_overwrite: true } }
    );
    return data;
  };
}

const TVApi = new TVApiC();

export default TVApi;
