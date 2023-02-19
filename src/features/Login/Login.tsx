import React from 'react';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {FormikHelpers, useFormik} from "formik";
import {useAppDispatch, useAppSelector} from "../../state/store";
import {logIn} from "./auth-reducer";
import {Navigate} from "react-router-dom";

type FormikValueType = {
  email: string
  password: string
  rememberMe: boolean
}

export const Login = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false
    },
    validate: (values) => {
      const errors: Partial<FormikValueType> = {};
      
      if (!values.email) {
        errors.email = 'Required';
      } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address';
      }
      // abcdeg12/abcdEG12 - valid pass
      // !/^(?=.*[A-Z].*[A-Z])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/i.test(values.password)
      if (values.password.length < 3) {
        errors.password = 'Password should be more 3 letters';
      }
      return errors;
    },
    onSubmit: async (values: FormikValueType, formikHelpers: FormikHelpers<FormikValueType>) => {
      const res = await dispatch(logIn(values));
      if (res.type === logIn.rejected.type) {
        if (res.payload) {
          formikHelpers.setErrors(res.payload);
        }
      }
    }
  });
  
  if (isLoggedIn) {
    return <Navigate to={'/'}/>;
  }
  
  return <Grid container justifyContent={'center'}>
    <Grid item justifyContent={'center'}>
      <FormControl>
        <FormLabel>
          <p>To log in get registered
            <a href={'https://social-network.samuraijs.com/'}
               rel="noreferrer"
               target={'_blank'}> here
            </a>
          </p>
          <p>or use common test account credentials:</p>
          <p>Email: free@samuraijs.com</p>
          <p>Password: free</p>
        </FormLabel>
        <form onSubmit={formik.handleSubmit}>
          <FormGroup>
            <TextField label="Email"
                       margin="normal"
                       {...formik.getFieldProps('email')}
            />
            {formik.touched.email && formik.errors.email && <div>{formik.errors.email}</div>}
            <TextField type="password"
                       label="Password"
                       margin="normal"
                       {...formik.getFieldProps('password')}
            />
            {formik.touched.password && formik.errors.password && <div>{formik.errors.password}</div>}
            <FormControlLabel label={'Remember me'}
                              control={
                                <Checkbox checked={formik.values.rememberMe}
                                          {...formik.getFieldProps('rememberMe')}
                                />}
            
            />
            <Button type={'submit'} variant={'contained'} color={'primary'}>
              Login
            </Button>
          </FormGroup>
        </form>
      </FormControl>
    </Grid>
  </Grid>;
};