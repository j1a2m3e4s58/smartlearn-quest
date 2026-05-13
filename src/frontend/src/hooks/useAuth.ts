import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const {
    login: connect,
    clear: disconnect,
    isAuthenticated,
    identity,
    loginStatus,
  } = useInternetIdentity();

  const login = async () => {
    try {
      await connect();
    } catch (e) {
      console.error("Login failed", e);
    }
  };

  const logout = async () => {
    try {
      await disconnect();
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  const principal = identity?.getPrincipal() ?? null;

  return {
    isAuthenticated: isAuthenticated ?? false,
    principal,
    identity,
    loginStatus,
    login,
    logout,
  };
}

export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useInternetIdentity();
  return isAuthenticated ?? false;
}

export function useIdentity() {
  const { identity } = useInternetIdentity();
  return identity;
}
