import React from 'react';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import {useAppDispatch, useAppSelector} from "../../state/store";
import {logInTC} from "./auth-reducer";
import {Navigate} from "react-router-dom";

type FormikErrorType = {
  email?: string
  password?: string
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
      const errors: FormikErrorType = {};
      
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
    onSubmit: values => {
      dispatch(logInTC(values));
      formik.resetForm();
    }
  });
  console.log(formik.errors);
  
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
            {/*                                        value={formik.values.password}
            {...formik.getFieldProps('email')} ===     onBlur={formik.handleBlur}
                                                       onChange={formik.handleChange}
            */}
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