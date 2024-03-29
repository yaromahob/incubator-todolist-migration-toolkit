import React, {useEffect} from 'react';
import LinearProgress from '@mui/material/LinearProgress/LinearProgress';
import Container from '@mui/material/Container/Container';
import {TodolistContainer} from "../components/Todolist/TodolistContainer";
import CircularProgress from "@mui/material/CircularProgress";
import {useAppDispatch, useAppSelector} from "../state/store";
import {ButtonAppBar} from "../components/ButtonAppBar";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Routes, Route, Navigate} from 'react-router-dom';
import {Login} from '../features/Login/Login';
import {authMe, logOut} from "../features/Login/auth-reducer";
import './App.css';


function App() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(state => state.app.status);
  const isInitialized = useAppSelector(state => state.app.isInitialized);
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);
  
  useEffect(() => {
    dispatch(authMe());
  }, []);
  
  if (!isInitialized) {
    return (
      <div style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
        <CircularProgress/>
      </div>
    );
  }
  
  const logInOut = () => {
    dispatch(logOut());
  };

  
  return (
    <div className="App">
      <div className="headerWrapper">
        <ErrorSnackbar/>
        <ButtonAppBar isLoggedIn={isLoggedIn} logInOut={logInOut}/>
        <div className="progressWrapper">
          {status === 'loading' && <LinearProgress color="secondary"/>}
        </div>
      </div>
      <Container fixed>
        <Routes>
          <Route path={"/"} element={<TodolistContainer/>}/>
          <Route path={"/login"} element={<Login/>}/>
          <Route path={"/404"} element={<h1>404: PAGE NOT FOUND</h1>}/>
          <Route path={"*"} element={<Navigate to={'/404'}/>}/>
        </Routes>
      </Container>
    </div>
  );
}


export default App;
