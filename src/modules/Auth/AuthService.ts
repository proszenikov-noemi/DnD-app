export const login = async (email: string, password: string) => {
    // Itt történne a bejelentkezés kezelése
    console.log('Bejelentkezés folyamatban:', { email, password });
  };
  
  export const register = async (email: string, password: string, username: string) => {
    // Itt történne a regisztráció kezelése
    console.log('Regisztráció folyamatban:', { email, password, username });
  };
  