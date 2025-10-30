// utils
import { useAuth0 } from '@auth0/auth0-react';

import { createAvatar } from '../utils/createAvatar';

//
import { Avatar, type Props as AvatarProps } from './Avatar';

// ----------------------------------------------------------------------

export function MyAvatar({ ...other }: AvatarProps) {
  const { user } = useAuth0();

  return (
    <Avatar
      src={user?.picture}
      alt={user?.name}
      color={user?.picture ? 'default' : createAvatar(user?.name ?? "Default").color}
      {...other}
    >
      {createAvatar(user?.name ?? "Default").name}
    </Avatar>
  );
}
