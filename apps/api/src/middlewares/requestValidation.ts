// (email?: string, password?: string, role?: string)

export const accCheck = (
  username?: string,
  password?: string,
  role?: string,
) => {
  const usernameRegex = /^[a-zA-Z0-9\s]+$/;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;

  if (username && !usernameRegex.test(username)) {
    throw 'Invalid username format!';
  }

  if (password && !passRegex.test(password)) {
    throw 'Invalid password format!';
  }

  if (role && role !== 'CASHIER' && role !== 'ADMIN') {
    throw 'Invalid role!';
  }
};
