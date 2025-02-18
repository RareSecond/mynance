import { createContext, useContext } from "react";

export const UserContext = createContext<{ email: string }>(null!);

export const useUser = () => {
  const user = useContext(UserContext);

  if (!user) {
    throw new Error("useUser must be used within a UserContext");
  }
  return user;
};
