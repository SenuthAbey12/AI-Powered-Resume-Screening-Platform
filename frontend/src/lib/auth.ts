export const auth = {

  isAuthenticated: () => {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem("auth") === "true";
  },


  signIn: () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth", "true");
    }
  },


  signOut: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth");
    }
  },

};