/// <reference types="auth0-lock" />
/// <reference types="node" />
import React, { ReactNode } from "react";
interface Props {
    storageKey: string;
    clientId: string;
    domain: string;
    options: Record<string, any>;
    showLock?: boolean;
    children: ReactNode;
}
export interface State {
    lock: Auth0LockStatic;
    login: () => void;
    logout: (returnTo: any) => void;
    expiresAt?: string;
    isAuthenticated?: boolean;
    accessToken?: AuthResult["accessToken"];
    idToken?: AuthResult["idToken"];
    idTokenPayload?: AuthResult["idTokenPayload"];
    profile?: any;
}
export default class AuthProvider extends React.Component<Props, State> {
    lock: Auth0LockStatic;
    tokenRenewalTimeout: null | NodeJS.Timeout;
    static defaultProps: {
        storageKey: string;
        options: {};
    };
    constructor(props: any);
    componentDidMount(): void;
    setSession: (authResult: any, profile: any) => void;
    storeSession: (session: any) => void;
    getStoredSession: () => any;
    isSessionExpired: (expiresAt: any) => boolean;
    rehyrate: () => void;
    login: () => void;
    logout: (returnTo: any) => void;
    scheduleRenewal: () => void;
    renewToken: () => void;
    render(): JSX.Element;
}
export {};
