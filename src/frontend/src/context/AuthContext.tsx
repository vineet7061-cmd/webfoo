import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export interface AuthUser {
  username: string;
  displayName: string;
}

interface AuthContextValue {
  currentUser: AuthUser | null;
  isInitializing: boolean;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    username: string,
    displayName: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AUTH_USER_KEY = "webfoo_auth_user";
const KNOWN_USERS_KEY = "webfoo_known_users";

interface StoredUser {
  username: string;
  displayName: string;
  passwordHash: string;
}

function simpleHash(str: string): string {
  // Simple deterministic hash for simulated auth (not secure, just for demo)
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function getKnownUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(KNOWN_USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveKnownUsers(users: StoredUser[]): void {
  localStorage.setItem(KNOWN_USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_USER_KEY);
      if (raw) {
        const user = JSON.parse(raw) as AuthUser;
        setCurrentUser(user);
      }
    } catch {
      // ignore
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const login = useCallback(
    async (
      username: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      if (!username.trim() || !password.trim()) {
        return { success: false, error: "Username and password are required." };
      }

      const knownUsers = getKnownUsers();
      const passwordHash = simpleHash(password);
      const existing = knownUsers.find(
        (u) => u.username.toLowerCase() === username.toLowerCase(),
      );

      if (existing) {
        // Registered user: verify password
        if (existing.passwordHash !== passwordHash) {
          return { success: false, error: "Incorrect password." };
        }
        const user: AuthUser = {
          username: existing.username,
          displayName: existing.displayName,
        };
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
        setCurrentUser(user);
        return { success: true };
      }

      // New/guest user: auto-create with username as display name
      const newUser: StoredUser = {
        username: username.trim(),
        displayName: username.trim(),
        passwordHash,
      };
      saveKnownUsers([...knownUsers, newUser]);

      const user: AuthUser = {
        username: newUser.username,
        displayName: newUser.displayName,
      };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    },
    [],
  );

  const register = useCallback(
    async (
      username: string,
      displayName: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      if (!username.trim()) {
        return { success: false, error: "Username is required." };
      }
      if (!displayName.trim()) {
        return { success: false, error: "Display name is required." };
      }
      if (!password.trim()) {
        return { success: false, error: "Password is required." };
      }

      const knownUsers = getKnownUsers();
      const alreadyExists = knownUsers.some(
        (u) => u.username.toLowerCase() === username.toLowerCase(),
      );

      if (alreadyExists) {
        return {
          success: false,
          error: "Username already taken. Please choose another.",
        };
      }

      const newUser: StoredUser = {
        username: username.trim(),
        displayName: displayName.trim(),
        passwordHash: simpleHash(password),
      };
      saveKnownUsers([...knownUsers, newUser]);

      const user: AuthUser = {
        username: newUser.username,
        displayName: newUser.displayName,
      };
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_USER_KEY);
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, isInitializing, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
