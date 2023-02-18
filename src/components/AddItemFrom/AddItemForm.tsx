import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './AddItemForm.css';

type AddItemFormPropsType = {
  addItem: (title: string) => void
  disabled?: boolean
}


export const AddItemForm: React.FC<AddItemFormPropsType> = memo((props) => {
  let [title, setTitle] = useState("");
  let [error, setError] = useState<string | null>(null);
  
  const addItem = () => {
    if (title.trim() !== "") {
      props.addItem(title);
      setTitle("");
    } else {
      setError("Title is required");
    }
  };
  
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };
  
  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    setError(null);
    if (e.charCode === 13) {
      addItem();
    }
  };
  
  return <div className="addItemForm">
    
    <TextField
      value={title}
      onChange={onChangeHandler}
      onKeyPress={onKeyPressHandler}
      disabled={props.disabled}
      id="outlined-basic"
      label={error ? "Title is required" : "type out here..."}
      variant="outlined"
      size="small"
      error={!!error}
    />
    
    <Button variant="contained"
            style={{maxWidth: '38px', maxHeight: '38px', minWidth: '38px', minHeight: '38px'}}
            onClick={addItem}>+</Button>
  
  </div>;
});
