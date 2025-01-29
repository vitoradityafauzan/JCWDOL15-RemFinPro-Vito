import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      'Invalid Username Format. Only letters, numbers and spaces are allowed',
    )
    .required('Username Is Required!'),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
      'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number. Special characters like quotation marks are not allowed.',
    )
    .required('Password Is Required!'),
});

export const editAccountSchema = yup.object().shape({
  username: yup
    .string()
    .matches(
      /^[a-zA-Z0-9\s]+$/,
      'Invalid Username Format. Only letters, numbers and spaces are allowed',
    )
    .required('Username Is Required!'),
  password: yup
    .string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/,
      'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, and one number. Special characters like quotation marks are not allowed.',
    ),
});

export const editProductSchema = yup.object().shape({
  productName: yup.string().required('Product Name Is Required!'),
  price: yup.number().required('Price Required'),
  categoryId: yup.number().required('Category Required'),
});

export const addProductSchema = yup.object().shape({
  productName: yup.string().required('Product Name Is Required!'),
  price: yup.number().required('Price Required'),
  // categoryId: yup.number().required('Category Required'),
  // stockAmount: yup.number().required('Stock Amount Required'),
});

// export const addProductSchema = yup.object().shape({
//   // imageUrl: yup.string(),
//   productName: yup.string().required('Product Name Is Required!'),
//   price: yup.number().moreThan(0, 'Price Required').required('Price Required'),
//   categoryId: yup
//     .number()
//     .moreThan(0, 'Category Required')
//     .required('Category Required'),
//   stockAmount: yup
//     .number()
//     .moreThan(0, 'Stock Amount Required')
//     .required('Stock Amount Required'),
// });
