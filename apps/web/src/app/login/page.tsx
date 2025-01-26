'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { simpleSwal, toastSwal } from '../utils/swalHelper';
import { ILogin } from '@/types/accountTypes';
import { loginSchema } from '../utils/formSchema';
import { login } from '@/lib/account';

export default function Login() {
  const router = useRouter();

  // const usernameRef = useRef<HTMLInputElement>(null);
  // const passwordRef = useRef<HTMLInputElement>(null);

  // const username = usernameRef.current?.value;
  // const password = passwordRef.current?.value;

  const handleLogin = async (data: ILogin, action: FormikHelpers<ILogin>) => {
    try {
      console.log('Log Comp, data form, \n');
      console.log(data);
      console.log('\n');

      // Sending Form Data To Action
      const { result } = await login(data);

      if (result.status === 'ok') {
        action.resetForm();

        router.push(result.user.role === 'CASHIER' ? '/' : '/admin');

        simpleSwal('success', 'Login Successfull');
      } else {
        throw result.msg;
      }
    } catch (error: any | string) {
      toastSwal('error', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-5 min-h-screen w-screen bg-[#b9e1da]">
      <div className="w-fit h-fit border-0">
        <Image
          src={`/image/Cashewier Logo.png`}
          alt="main icon"
          width={0}
          height={0}
          sizes="100vw"
          className="w-80 h-64"
        />
      </div>
      <div className="flex flex-col items-center justify-center w-fit h-fit bg-white rounded-2xl shadow-2xl ">
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={loginSchema}
          onSubmit={handleLogin}
        >
          {() => {
            return (
              <Form className="flex flex-col gap-5 p-5  border-0">
                {/* Input Username */}
                <label className="form-control w-full max-w-lg">
                  <div className="label">
                    <span className="label-text text-lg">Username</span>
                  </div>
                  <Field
                    type="text"
                    name="username"
                    placeholder="Type username"
                    className="input input-bordered input-accent w-full max-w-md p-3 rounded-lg"
                  />
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-red-500"
                  />
                </label>
                {/* Input Password */}
                <label className="form-control w-full max-w-md">
                  <div className="label">
                    <span className="label-text text-lg">Password</span>
                  </div>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Type password here"
                    className="input input-bordered input-accent w-full max-w-md p-3 rounded-lg"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500"
                  />
                </label>
                <button className="btn btn-outline btn-accent" type="submit">
                  Sign In
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}
