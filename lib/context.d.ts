import React from "react";
import { State } from "./AuthProvider/AuthProvider";
declare const context: React.Context<State>;
declare const Provider: React.Provider<State>;
declare const Consumer: React.Consumer<State>;
export { Provider, Consumer };
export default context;
