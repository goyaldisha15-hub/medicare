import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // check localStorage on mount

  // On app load — check if user already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("medicare_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Mock users database
  const MOCK_USERS = [
    { id: 1, name: "Ayesha ", email: "ayesha@gmail.com", password: "123456", role: "patient" },
    { id: 2, name: "Dr. vanshi", email: "vanshi@gmail.com", password: "doctor123", role: "doctor" },
  ];

  const login = async (email, password) => {
    setLoading(true);
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 1200));

    const found = MOCK_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      setLoading(false);
      throw new Error("Invalid email or password");
    }

    const userData = { id: found.id, name: found.name, email: found.email, role: found.role };
    localStorage.setItem("medicare_user", JSON.stringify(userData));
    setUser(userData);
    setLoading(false);
    return userData;
  };

  const register = async (name, email, password) => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 1200));

    // Check if email already exists
    const exists = MOCK_USERS.find((u) => u.email === email);
    if (exists) {
      setLoading(false);
      throw new Error("Email already registered");
    }

    const newUser = { id: Date.now(), name, email, role: "patient" };
    localStorage.setItem("medicare_user", JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
    return newUser;
  };

  const logout = () => {
    localStorage.removeItem("medicare_user");
    setUser(null);
  };

  const value = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}