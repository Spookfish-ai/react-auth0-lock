import React from "react";
import { AuthProviderState } from "./AuthProvider/AuthProvider";

const context = React.createContext<AuthProviderState>({
  lock: undefined,
  login: () => null,
  logout: () => null,
  expiresAt: null,
});

const Provider = context.Provider;
const Consumer = context.Consumer;

export { Provider, Consumer };

export default context;
