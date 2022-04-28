import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import AddIcon from '@mui/icons-material/Add';
import { blue } from '@mui/material/colors';

import DialogContainer from './dialog.container';

const useStyles = makeStyles({
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  },
});

function InterstitialDialog(props) {
  const classes = useStyles();
  const { onClose, dialogTitle, options, open } = props;

  const handleListItemClick = (cb) => {
    onClose();
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
          isOpen={option.open} 
          inner_component={option.component} 
        />
      ))}
      <DialogContainer 
        onClose={onClose} 
        isOpen={open} 
        title={dialogTitle} 
        inner_component={(
          <List>
            {options.map((option) => (
              <ListItem button onClick={() => handleListItemClick(option.cb)} key={option.title}>
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
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

InterstitialDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  dialogTitle: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  open: PropTypes.bool.isRequired,
};

export default InterstitialDialog;