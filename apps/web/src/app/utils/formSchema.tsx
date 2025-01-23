import * as yup from 'yup';

export const loginSchema = yup.object().shape({
    username: yup
      .string()
      .matches(
        /^[a-zA-Z0-9\s]+$/,
        'Invalid Username Format. Only letters, numbers and spaces are allowed'
      )
      .required('Username Is Required!'),
    password: yup
      .string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
        'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number. Special characters like quotation marks are not allowed.'
      )
      .required('Password Is Required!')
  });