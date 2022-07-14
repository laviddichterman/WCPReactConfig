// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
};

export const PATH_PAGE = {
  page403: '/403',
  page404: '/404',
  page500: '/500',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    timing: path(ROOTS_DASHBOARD, '/timing'),
    credit: path(ROOTS_DASHBOARD, '/credit'),
    catalog: path(ROOTS_DASHBOARD, '/catalog'),
    settings: path(ROOTS_DASHBOARD, '/settings'),
  },
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    // new: path(ROOTS_DASHBOARD, '/user/new'),
    // list: path(ROOTS_DASHBOARD, '/user/list'),
    // cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    // account: path(ROOTS_DASHBOARD, '/user/account'),
    // edit: (name) => path(ROOTS_DASHBOARD, `/user/${name}/edit`),
  },
};
