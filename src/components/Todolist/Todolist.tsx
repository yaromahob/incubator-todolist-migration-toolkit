import React, {memo, useCallback, useEffect} from 'react';
import {EditableSpan} from "../EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {AddItemForm} from "../AddItemFrom/AddItemForm";
import {useAppDispatch, useAppSelector} from "../../state/store";
import {
  changeFilter,
  FilterValuesType,
  removeTodoListTC,
  updateTodolistTitleTC
} from "../../state/todolist-reducer";
import {
  addTaskTC, changeEntityStatus,
  deleteTasks,
  fetchTasks,
  updateTaskTC,
  updateTaskTitleTC
} from "../../state/task-reducer";
import Task from "../Task/Task";
import ButtonContainer from "../ButtonContainer";
import {TaskStatusesType} from "../../api/task-api";
import {RequestStatusType} from "../../App/app-reducer";
import styles from './Todolist.module.scss';


export type TodolistPropsType = {
  todolistId: string
  title: string
  filter: FilterValuesType
  entityStatus: RequestStatusType
  addedDate: string
  order: number
}

export const Todolist = memo(({todolistId, filter, title, entityStatus}: TodolistPropsType) => {
  console.log('Todolist_RERENDER');
  const dispatch = useAppDispatch();
  let tasks = useAppSelector(state => state.tasks[todolistId]);
  useEffect(() => {
    dispatch(fetchTasks(todolistId));
  }, [dispatch, todolistId]);
  
  const addTask = useCallback(
    (title: string) => {
      dispatch(addTaskTC({todolistId, title}));
    },
    [dispatch, todolistId],
  );
  
  
  const removeTodolist = useCallback(() => {
    dispatch(removeTodoListTC(todolistId));
  }, [dispatch, todolistId]);
  
  const changeTodolistTitle = useCallback((title: string) => {
    dispatch(updateTodolistTitleTC(todolistId, title));
  }, [dispatch, todolistId]);
  
  const changeTaskStatus = useCallback((todolistId: string, taskID: string, status: TaskStatusesType) => {
    dispatch(updateTaskTC(todolistId, taskID, status));
  }, [dispatch]);
  
  const changeTaskTitle = useCallback((todolistId: string, taskID: string, title: string) => {
    dispatch(updateTaskTitleTC(todolistId, taskID, title));
  }, [dispatch]);
  
  
  const onAllClickHandler = useCallback(() => dispatch(changeFilter({
    filter: 'all',
    id: todolistId
  })), [dispatch, todolistId]);
  
  const onActiveClickHandler = useCallback(() => dispatch(changeFilter({
    filter: 'active',
    id: todolistId
  })), [dispatch, todolistId]);
  
  const onCompletedClickHandler = useCallback(() => dispatch(changeFilter({
    filter: 'completed',
    id: todolistId
  })), [dispatch, todolistId]);
  
  const onClickRemoveHandler = useCallback((taskId: string) => {
    dispatch(deleteTasks({todolistId: todolistId, taskId: taskId}));
  }, [dispatch, todolistId]);
  
  const onChangeStatusHandler = useCallback((taskID: string, status: TaskStatusesType) => {
    changeTaskStatus(todolistId, taskID, status);
  }, [changeTaskStatus, todolistId]);
  
  const onChangeTitleHandler = useCallback((taskID: string, newValue: string) => {
    changeTaskTitle(todolistId, taskID, newValue);
    dispatch(changeEntityStatus({todolistId, taskID, entityStatus: 'loading'}));
  }, [changeTaskTitle, todolistId]);
  
  
  if (filter === "active") {
    tasks = tasks.filter(t => !t.status);
  }
  if (filter === "completed") {
    tasks = tasks.filter(t => t.status);
  }
  
  
  return (
    <div className={styles.todolistWrapper}>
      <div className={styles.header}>
        <div className={styles.title}>
          <EditableSpan value={title} onChange={changeTodolistTitle}/>
        </div>
        <IconButton aria-label="delete"
                    onClick={removeTodolist}
                    disabled={entityStatus === "loading"}>
          <DeleteIcon/>
        </IconButton>
      </div>
      <AddItemForm addItem={addTask} disabled={entityStatus === "loading"}/>
      {tasks.length
        ? <ul>{tasks.map((t) => {
          
          
          return (
            <Task key={t.id}
                  taskID={t.id}
                  todolistID={t.todoListId}
                  status={t.status}
                  title={t.title}
                  entityStatus={t.entityStatus}
                  onChangeStatus={onChangeStatusHandler}
                  onChangeTitle={onChangeTitleHandler}
                  onClickRemove={onClickRemoveHandler}
            />
          );
        })}</ul>
        : <p className={styles.emptyField}>No tasks</p>
      }
      <div className={styles.buttonWrapper}>
        <ButtonContainer buttonTitle={'All'}
                         buttonColor={"primary"}
                         callback={onAllClickHandler}/>
        <ButtonContainer buttonTitle={'Active'}
                         buttonColor={"inherit"}
                         callback={onActiveClickHandler}/>
        <ButtonContainer buttonTitle={'Completed'}
                         buttonColor={"success"}
                         callback={onCompletedClickHandler}/>
      
      </div>
    </div>);
});

