// sections
import { useAuth0 } from '@auth0/auth0-react';

import { Card, Container } from '@mui/material';

// components
import { HeaderBreadcrumbs } from '../../components/HeaderBreadcrumbs';
import { Page } from '../../components/Page';
// hooks
import { useSettings } from '../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
import {
  ProfileCover,
} from '../../sections/@dashboard/user/profile';


export default function UserProfile() {
  const { themeStretch } = useSettings();

  const { user } = useAuth0();


  return (
    <Page title="User: Profile">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Profile"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: user?.name || '' },
          ]}
        />
        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative',
          }}
        >
          <ProfileCover />

        </Card>

      </Container>
    </Page>
  );
}
