import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';

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