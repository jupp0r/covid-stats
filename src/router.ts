import { Action } from "./actions";
import { State } from "./store";

import { Store } from "redux";

import { makeUrlUpdated } from "./actions";

export const updateCountriesInPathName = (
  urlString: string,
  countries: string[],
): string => {
  const url = new URL(urlString);
  const params = new URLSearchParams(url.search);
  params.set("countries[]", JSON.stringify(countries));
  url.search = params.toString();
  return url.toString();
};

export const getPickedCountriesFromUrl = (urlString: string): string[] => {
  const url = new URL(urlString);
  const params = new URLSearchParams(url.search);
  const countries = params.get("countries[]");
  if (!countries) {
    console.log("no countries field found", url, params);
    return ["USA"];
  }

  const parsedCountries: string[] = JSON.parse(countries);

  if (!Array.isArray(parsedCountries)) {
    console.error("invalid url params");
    return ["USA"];
  }

  return parsedCountries;
};

export const setupRouting = (store: Store<State, Action>) => {
  window.addEventListener("popstate", () => {
    store.dispatch(makeUrlUpdated(window.location.toString()));
  });

  store.subscribe(() => {
    const { url } = store.getState().routing;
    if (window.location.toString() !== url) {
      window.history.pushState(null, "", url);
      document.body.scrollTop = 0;
    }
  });
};
