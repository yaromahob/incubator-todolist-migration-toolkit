import React, {memo} from 'react';
import Button from "@mui/material/Button";

type ButtonContainerType = {
  buttonTitle: string
  buttonColor:
    'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning',
  
  callback: () => void
}

export const ButtonContainer: React.FC<ButtonContainerType> = memo(({buttonTitle, buttonColor, callback}) => {
  return (
    <Button variant={"contained"}
            color={buttonColor}
            onClick={callback}
    >
      {buttonTitle}
    </Button>
  
  );
});


