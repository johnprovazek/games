// Code adapted from useLocalStorage hook developed by uidotdev
//
// https://usehooks.com/uselocalstorage
// https://github.com/uidotdev/usehooks
//
// This implementation adds an optional validate function prop to validate the initial local storage result.

import * as React from "react";

const dispatchStorageEvent = (key, newValue) => {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
};

const setItem = (key, value) => {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
};

const removeItem = (key) => {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
};

const getItem = (key) => {
  return window.localStorage.getItem(key);
};

const subscribe = (callback) => {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const getServerSnapshot = () => {
  throw Error("useLocalStorage is a client-only hook");
};

export default function useLocalStorage(key, initialValue, validate) {
  const getSnapshot = () => getItem(key);

  const store = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setState = React.useCallback(
    (v) => {
      try {
        const nextState = typeof v === "function" ? v(JSON.parse(store)) : v;

        if (nextState === undefined || nextState === null) {
          removeItem(key);
        } else {
          setItem(key, nextState);
        }
      } catch (e) {
        console.warn(e);
      }
    },
    [key, store],
  );

  React.useEffect(() => {
    if (getItem(key) === null && typeof initialValue !== "undefined") {
      setItem(key, initialValue);
    } else if (validate) {
      let initItem = JSON.parse(getItem(key));
      setItem(key, validate(initItem));
    }
  }, [key, initialValue, validate]);

  return [store ? JSON.parse(store) : initialValue, setState];
}
