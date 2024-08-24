import { Card, Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import { useSettings } from '../../hooks/useSettings';
// components
import { HeaderBreadcrumbs } from '../../components/HeaderBreadcrumbs';
import { Page } from '../../components/Page';
// sections
import { useAuth0 } from '@auth0/auth0-react';
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
