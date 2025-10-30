import { type ReactElement } from 'react';

import { type BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

export type NavListProps = {
  title: string;
  path: string;
  icon?: ReactElement;
  info?: ReactElement;
  caption?: string;
  disabled?: boolean;
  roles?: string[];
  children?: any;
};

export type NavItemProps = {
  item: NavListProps;
  depth: number;
  open: boolean;
  active: boolean;
  isCollapse?: boolean;
};

export interface NavSectionProps extends BoxProps {
  isCollapse?: boolean;
  navConfig: {
    subheader: string;
    items: NavListProps[];
  }[];
}
