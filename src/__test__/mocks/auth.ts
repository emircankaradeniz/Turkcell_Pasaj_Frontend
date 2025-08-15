// src/__test__/mocks/auth.ts
let currentUser: any = null;

export const __setMockUser = (u: any) => {
  currentUser = u;
};

export const useAuth = () => ({
  kullanici: currentUser,
});
