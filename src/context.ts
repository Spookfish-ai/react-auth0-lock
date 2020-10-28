import React from "react";
import { State } from "./AuthProvider/AuthProvider";

export const { Provider, Consumer } = React.createContext<State>({
  lock: undefined,
  login: () => null,
  logout: () => null,
  expiresAt: null,
});
