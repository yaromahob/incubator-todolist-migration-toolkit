import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

type ButtonAppBarType = {
  isLoggedIn: boolean
  logInOut: () => void
}

export const ButtonAppBar: React.FC<ButtonAppBarType> = ({
                                                           isLoggedIn,
                                                           logInOut
                                                         }) => {
  
  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
            T O D O L I S T
          </Typography>
          {isLoggedIn &&
            <Button color="inherit" variant={'outlined'} size={'large'} onClick={logInOut}>Log Out</Button>}
        </Toolbar>
      </AppBar>
    </Box>
  );
};
