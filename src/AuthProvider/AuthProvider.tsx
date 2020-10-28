import Auth0Lock from "auth0-lock";
import React, { ReactNode } from "react";
import { Provider } from "../context";

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

  static defaultProps = {
    storageKey: "auth:auth0",
    options: {},
  };

  constructor(props) {
    super(props);
    this.lock = new Auth0Lock(props.clientId, props.domain, props.options);
    this.tokenRenewalTimeout = null;
    this.state = {
      lock: this.lock,
      login: this.login,
      logout: this.logout,
      expiresAt: null,
    };
  }

  componentDidMount() {
    this.rehyrate(); // Sync local storage to state
    this.lock.on("authenticated", (authResult) => {
      this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
        if (error) {
          throw new Error(error.description);
        }
        this.setSession(authResult, profile);
      });
    });
  }

  setSession = (authResult, profile) => {
    const session = {
      isAuthenticated: true,
      accessToken: authResult.accessToken,
      idToken: authResult.idToken,
      idTokenPayload: authResult.idTokenPayload,
      expiresAt: JSON.stringify(
        authResult.expiresIn * 1000 + new Date().getTime()
      ),
      profile: profile,
    };

    this.setState(
      (currentState) => ({ ...currentState, ...session }),
      () => {
        this.lock.hide();
        this.scheduleRenewal();
        this.storeSession(session);
      }
    );
  };

  storeSession = (session) => {
    const { storageKey } = this.props;
    localStorage.setItem(storageKey, JSON.stringify(session));
  };

  getStoredSession = () => {
    const { storageKey } = this.props;
    const session = localStorage.getItem(storageKey);
    return session ? JSON.parse(session) : null;
  };

  isSessionExpired = (expiresAt) => {
    return new Date().getTime() > expiresAt;
  };

  rehyrate = () => {
    const { showLock } = this.props;
    const session = this.getStoredSession();
    if (session && !this.isSessionExpired(session.expiresAt)) {
      this.setState(session, () => {
        this.scheduleRenewal();
      });
    } else {
      if (showLock) {
        this.lock.show();
      }
    }
  };

  login = () => {
    this.lock.show();
  };

  logout = (returnTo) => {
    const { storageKey } = this.props;
    localStorage.removeItem(storageKey);
    clearTimeout(this.tokenRenewalTimeout);
    this.lock.logout({
      returnTo: returnTo,
    });
  };

  scheduleRenewal = () => {
    const { expiresAt } = this.state;
    const delay = Number(expiresAt) - Date.now();
    if (delay > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewToken();
      }, delay);
    }
  };

  renewToken = () => {
    this.lock.checkSession({}, (err, authResult) => {
      if (err || !authResult) {
        this.lock.show();
      } else {
        this.lock.getUserInfo(authResult.accessToken, (error, profile) => {
          this.setSession(authResult, profile);
        });
      }
    });
  };

  render() {
    const { children } = this.props;
    return <Provider value={this.state}>{children}</Provider>;
  }
}
