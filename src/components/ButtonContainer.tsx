import React, {memo} from 'react';
import Button from "@mui/material/Button";
import { FilterValuesType } from '../state/todolist-reducer';

type ButtonContainerType = {
  filter: FilterValuesType
  buttonTitle: string
  buttonColor:
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
  
  callback: () => void
}

const ButtonContainer: React.FC<ButtonContainerType> = memo(({filter, buttonTitle, buttonColor, callback}) => {
  const selectVariant = filter === buttonTitle.toLowerCase() ? "outlined" : "contained";
  return (
    <Button variant={selectVariant}
            color={buttonColor}
            onClick={callback}
    >
      {buttonTitle}
    </Button>
  
  );
});

export default ButtonContainer;
