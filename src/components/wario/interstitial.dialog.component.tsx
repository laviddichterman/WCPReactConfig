import React from 'react';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';

import DialogContainer, { IDialogContainer } from './dialog.container';

interface InterstitialDialogProps {
  onClose: IDialogContainer['onClose'];
  dialogTitle: string;
  options: { title: string; 
    onClose: IDialogContainer['onClose']; 
    open: boolean; 
    component: React.ReactNode; 
    cb: VoidFunction;
  }[];
  open: boolean;
};

export default function InterstitialDialog(props : InterstitialDialogProps) {
  const { onClose, dialogTitle, options, open } = props;

  const handleListItemClick = (e : React.MouseEvent<HTMLDivElement>, cb: VoidFunction) => {
    onClose(e, 'backdropClick');
    cb();
  };

  return (
    <>
      {options.map((option) => (
        <DialogContainer 
          maxWidth={"xl"}
          key={option.title} 
          title={option.title}
          onClose={option.onClose} 
          open={option.open} 
          inner_component={option.component} 
        />
      ))}
      <DialogContainer 
        onClose={onClose} 
        open={open} 
        title={dialogTitle} 
        inner_component={(
          <List>
            {options.map((option) => (
              <ListItem button onClick={(e) => handleListItemClick(e, option.cb)} key={option.title}>
                <ListItemAvatar>
                  <Avatar>
                    <AddIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={option.title} />
              </ListItem>
            ))}
          </List>
        )}
      />
    </>
  );
}