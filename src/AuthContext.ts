import React from "react";
import { UserManagerSettings, User, SessionStatus } from "oidc-client-ts";

import { AuthState } from "./AuthState";

export interface AuthContextProps extends AuthState {
    /**
     * UserManager functions. See [UserManager](https://github.com/pamapa/oidc-client-ts) for more details.
     */
     readonly settings: UserManagerSettings;
     clearStaleState(): Promise<void>;
     removeUser(): Promise<void>;
     signinPopup(): Promise<User>;
     signinSilent(): Promise<User | null>;
     signinRedirect(): Promise<void>;
     signoutRedirect(): Promise<void>;
     signoutPopup(): Promise<void>;
     querySessionStatus(): Promise<SessionStatus | null>;
     revokeAccessToken(): Promise<void>;
     startSilentRenew(): void;
     stopSilentRenew(): void;
}

export const AuthContext = React.createContext<AuthContextProps>(undefined as any);
AuthContext.displayName = "AuthContext";
