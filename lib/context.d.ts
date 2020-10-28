import React from "react";
import { AuthProviderState } from "./AuthProvider/AuthProvider";
declare const context: React.Context<AuthProviderState>;
declare const Provider: React.Provider<AuthProviderState>;
declare const Consumer: React.Consumer<AuthProviderState>;
export { Provider, Consumer };
export default context;
