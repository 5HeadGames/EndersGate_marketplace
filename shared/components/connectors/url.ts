import { initializeConnector } from "@web3-react/core";
// import { Url } from "@web3-react/url";
import { URLS } from "../chains";

export const [url, hooks] = initializeConnector<any>((actions) => {
  return { actions, url: URLS[1][0] };
});
