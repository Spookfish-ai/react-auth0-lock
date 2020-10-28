import React from "react";
import { State } from "./AuthProvider/AuthProvider";

const context = React.createContext<State>({
  lock: undefined,
  login: () => null,
  logout: () => null,
  expiresAt: null,
});

const Provider = context.Provider;
const Consumer = context.Consumer;

export { Provider, Consumer };

export default context;
