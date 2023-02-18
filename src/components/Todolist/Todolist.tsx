import React, {memo, useCallback, useEffect} from 'react';
import {EditableSpan} from "../EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {AddItemForm} from "../AddItemFrom/AddItemForm";
import {useAppDispatch, useAppSelector} from "../../state/store";
import {
  changeFilterAC,
  FilterValuesType,
  removeTodoListTC,
  updateTodolistTitleTC
} from "../../state/todolist-reducer";
import {
  addTaskTC, changeEntityStatusAC,
  deleteTasks,
  fetchTasks, TasksDomainType,
  updateTaskTC,
  updateTaskTitleTC
} from "../../state/task-reducer";
import Task from "../Task/Task";
import ButtonContainer from "../ButtonContainer";
import {TaskStatusesType, TTaskApi} from "../../api/task-api";
import {RequestStatusType} from "../../App/app-reducer";
import './todolist.css';


export type TodolistPropsType = {
  todolistId: string
  title: string
  filter: FilterValuesType
  entityStatus: RequestStatusType
  addedDate: string
  order: number
}

const Todolist = memo(({todolistId, filter, title, entityStatus}: TodolistPropsType) => {
  console.log('Todolist_RERENDER');
  
  const dispatch = useAppDispatch();
  let tasks = useAppSelector<Array<TTaskApi & TasksDomainType>>(state => state.tasks[todolistId]);
  useEffect(() => {
    dispatch(fetchTasks(todolistId));
  }, [dispatch, todolistId]);
  
  const addTask = useCallback(
    (title: string) => {
      dispatch(addTaskTC(todolistId, title));
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
  
  
  const onAllClickHandler = useCallback(() => dispatch(changeFilterAC({
    filter: 'all',
    id: todolistId
  })), [dispatch, todolistId]);
  
  const onActiveClickHandler = useCallback(() => dispatch(changeFilterAC({
    filter: 'active',
    id: todolistId
  })), [dispatch, todolistId]);
  
  const onCompletedClickHandler = useCallback(() => dispatch(changeFilterAC({
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
    dispatch(changeEntityStatusAC({todolistId, taskID, entityStatus: 'loading'}));
  }, [changeTaskTitle, todolistId]);
  
  
  if (filter === "active") {
    tasks = tasks.filter(t => !t.status);
  }
  if (filter === "completed") {
    tasks = tasks.filter(t => t.status);
  }
  
  return (
    <div>
      <h3>
        <EditableSpan value={title} onChange={changeTodolistTitle}/>
        {/*<button onClick={removeTodolist}>x</button>*/}
        <IconButton aria-label="delete"
                    onClick={removeTodolist}
                    disabled={entityStatus === "loading"}>
          <DeleteIcon/>
        </IconButton>
      </h3>
      <AddItemForm addItem={addTask} disabled={entityStatus === "loading"}/>
      <ul>
        {
          tasks.map((t) => {
            
            
            return (
              <Task key={t.id}
                    taskID={t.id}
                    status={t.status}
                    title={t.title}
                    entityStatus={t.entityStatus}
                    onChangeStatus={onChangeStatusHandler}
                    onChangeTitle={onChangeTitleHandler}
                    onClickRemove={onClickRemoveHandler}
              />
            );
          })
        }
      </ul>
      <div className="buttonWrapper">
        <ButtonContainer filter={filter}
                         buttonTitle={'All'}
                         buttonColor={"secondary"}
                         callback={onAllClickHandler}/>
        <ButtonContainer filter={filter}
                         buttonTitle={'Active'}
                         buttonColor={"success"}
                         callback={onActiveClickHandler}/>
        <ButtonContainer filter={filter}
                         buttonTitle={'Completed'}
                         buttonColor={"error"}
                         callback={onCompletedClickHandler}/>
      
      </div>
    </div>);
});

export default Todolist;
