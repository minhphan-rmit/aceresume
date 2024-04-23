

import { Alert, Snackbar } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';

type MessageType = 'success' | 'error' | 'info' | 'warning';

interface NotifyProps {
  message: string,
  type: MessageType,
  verticalPosition?: 'top' | 'bottom',
  horizontalPosition?: 'left' | 'right' | 'center'
}

const NotificationSnackbar: React.FC<NotifyProps> = ({message, type, verticalPosition, horizontalPosition}) => {

  return (
    <Snackbar
      anchorOrigin={{ vertical: verticalPosition ? verticalPosition : 'top', horizontal: horizontalPosition ? horizontalPosition :'center' }}
      open={true}
      sx={{position: 'fixed', zIndex: 1500}}
    >
      <Alert severity={type} sx={{ width: '100%' }}>
          {message}
      </Alert>
    </Snackbar>
  );
};

const showNotification = ({ message, type, verticalPosition, horizontalPosition }: NotifyProps) => {
    const container = document.createElement('div');
    document.body.appendChild(container);

    ReactDOM.render(
      <NotificationSnackbar message={message} type={type} verticalPosition={verticalPosition} horizontalPosition={horizontalPosition} />,
      container
    );

    setTimeout(() => {
      document.body.removeChild(container);
    }, 5000);
  };

  export default showNotification;
