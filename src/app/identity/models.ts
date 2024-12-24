export type User = {
  username: string;
  isAdmin: boolean;
};

export type AuthResponse = {
  user: User;
  authToken: string;
};
