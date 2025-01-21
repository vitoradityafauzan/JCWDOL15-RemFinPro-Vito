
export const accCheck = (email?: string, password?: string, role?: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
  
    // if (!email || !password || !role) {
    //   throw 'Please fill in all fields!';
    // }
  
    if (email && !emailRegex.test(email)) {
      throw 'Invalid email format!';
    }
  
    if (password && !passRegex.test(password)) {
      throw 'Invalid password format!';
    }
  
    if (role && role !== 'CASHIER' && role !== 'ADMIN') {
      throw 'Invalid role!';
    }
  };