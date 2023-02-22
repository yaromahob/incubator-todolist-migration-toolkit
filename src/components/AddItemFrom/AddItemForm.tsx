import React, {ChangeEvent, KeyboardEvent, memo, useState} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import styles from './AddItemForm.module.scss';

type AddItemFormPropsType = {
  addItem: (title: string) => void
  disabled?: boolean
}


export const AddItemForm: React.FC<AddItemFormPropsType> = memo((props) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  
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
    
    if (e.currentTarget.value.length > 20) {
      setError("max length 20");
    } else {
      setError(null);
    }
  };
  
  const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (title.length > 20) return;
    setError(null);
    if (e.charCode === 13) {
      addItem();
    }
  };
  
  return <div className={styles.addItemForm}>
    <div className={styles.writeFieldWrapper}>
      <TextField
        value={title}
        onChange={onChangeHandler}
        onKeyPress={onKeyPressHandler}
        disabled={props.disabled}
        id="outlined-basic"
        label={error ? error : `type out here... ${title.length ? title.length : ''}`}
        variant="outlined"
        size="small"
        error={!!error}
      />
    </div>
    
    
    <Button variant="contained"
            style={{maxWidth: '38px', maxHeight: '38px', minWidth: '38px', minHeight: '38px'}}
            onClick={addItem} disabled={!!error}>+</Button>
  
  </div>;
});
