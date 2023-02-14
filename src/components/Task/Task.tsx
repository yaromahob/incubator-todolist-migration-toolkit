import React, {ChangeEvent, memo} from 'react';
import Checkbox from "@mui/material/Checkbox";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import {TaskStatusesType} from "../../api/task-api";
import {RequestStatusType} from "../../App/app-reducer";

type TaskType = {
  taskID: string
  status: TaskStatusesType
  title: string
  entityStatus: RequestStatusType
  onClickRemove: (taskId: string) => void
  onChangeStatus: (taskID: string, status: TaskStatusesType) => void
  onChangeTitle: (taskID: string, title: string) => void
}

const Task: React.FC<TaskType> = memo(({
                                         taskID,
                                         status,
                                         title,
                                         entityStatus,
                                         onClickRemove,
                                         onChangeStatus,
                                         onChangeTitle
                                       }) => {
  console.log('TASK_RERENDER');
  
  const onClickRemoveHandler = () => {
    onClickRemove(taskID);
  };
  
  const onChangeStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let isCompleted = e.currentTarget.checked;
    onChangeStatus(taskID, status);
  };
  
  const onChangeTitleHandler = (newValue: string) => {
    onChangeTitle(taskID, newValue);
  };
  
  return (
    <li key={taskID} className={status ? "is-done" : ""}>
      <Checkbox onChange={onChangeStatusHandler} checked={status === 2}/>
      <EditableSpan value={title} onChange={onChangeTitleHandler}/>
      <IconButton aria-label="delete" onClick={onClickRemoveHandler} disabled={entityStatus === 'loading'}>
        <DeleteIcon/>
      </IconButton>
    </li>
  );
});

export default Task;
