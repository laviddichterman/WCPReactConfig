import React from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';

function DialogContainer({ onClose, title, inner_component, isOpen, ...other }) {
  return (
    <Dialog {...other} onClose={onClose} aria-labelledby="simple-dialog-title" open={isOpen}>
      <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
      <Divider />
      {inner_component}
    </Dialog>
  );
}

export default DialogContainer;