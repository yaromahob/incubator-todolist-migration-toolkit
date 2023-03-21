import React, {useCallback, useEffect} from 'react';
import Grid from "@mui/material/Grid/Grid";
import {AddItemForm} from "../AddItemFrom/AddItemForm";
import Paper from "@mui/material/Paper/Paper";
import {Todolist} from "./Todolist";
import {useAppDispatch, useAppSelector} from "../../state/store";
import {createTodoList, getTodoList} from "../../state/todolist-reducer";
import {Navigate} from "react-router-dom";

const TodolistContainer = () => {
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);
  const todolists = useAppSelector(state => state.todolists);
  const dispatch = useAppDispatch();
  
  const addTodolist = useCallback(
    (title: string) => {
      dispatch(createTodoList(title));
    },
    [dispatch],
  );
  
  useEffect(() => {
    if (!isLoggedIn) return;
    
    dispatch(getTodoList());
  }, [dispatch]);
  
  if (!isLoggedIn) {
    return <Navigate to={"/login"}/>;
  }
  return (
    <>
      <Grid container style={{padding: "40px 40px 40px 0px"}}>
        <AddItemForm addItem={addTodolist}/>
      </Grid>
      
      <Grid container spacing={3}>
        {todolists.map(tl => {
          
          return <Grid item key={tl.id}>
            <Paper style={{padding: "10px"}}>
              <Todolist
                todolistId={tl.id}
                entityStatus={tl.entityStatus}
                title={tl.title}
                filter={tl.filter}
                addedDate={tl.addedDate}
                order={tl.order}
              />
            </Paper>
          </Grid>;
        })}
      </Grid>
    
    </>
  );
};

export default TodolistContainer;
