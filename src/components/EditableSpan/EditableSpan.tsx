import React, {ChangeEvent, useEffect, useState} from 'react';
import TextField from "@mui/material/TextField";
import styles from './EditableSpan.module.scss';

type EditableSpanPropsType = {
  id?: string
  todolistID?: string
  value: string
  onChange: (newValue: string) => void
}

export const EditableSpan: React.FC<EditableSpanPropsType> = ({value, onChange}) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(value);
  const [isErrorTitle, setIsErrorTitle] = useState('');
  const [error, setError] = useState<null | string>(null);
  
  useEffect(() => {
    setIsErrorTitle(value);
  }, []);
  
  const activateEditMode = () => {
    setEditMode(true);
    setTitle(value);
  };
  
  const activateViewMode = () => {
    setEditMode(false);
    
    if (title.length > 20) {
      onChange(isErrorTitle);
      
    } else onChange(title);
  };
  
  const changeTitle = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
    
    if (e.currentTarget.value.length > 20) {
      setError("max length 20");
      
    } else {
      setError(null);
    }
  };
  
  return (
    <div className={styles.editSpanWrapper}>
      {
        editMode
          ? <TextField
            value={title}
            onChange={changeTitle}
            onBlur={activateViewMode}
            id="outlined-basic"
            label={error ? error : `type out here... ${title.length ? title.length : ''}`}
            variant="outlined"
            size="small"
            autoFocus
            error={!!error}
          />
          : <span onDoubleClick={activateEditMode}>{value}</span>
      }
    </div>
  );
  
}
