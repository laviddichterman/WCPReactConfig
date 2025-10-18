// @mui
import { Container, Dialog, Grid } from '@mui/material';
// hooks
import { useSettings } from '../../hooks/useSettings';
// components
import { Page } from '../../components/Page';
// sections
import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useState } from 'react';
import { OrderCalendar } from '../../components/wario/orders/OrderCalendar';
import { OrderManagerComponent } from '../../components/wario/orders/OrderManager';
import { WOrderComponentCard } from '../../components/wario/orders/WOrderComponentCard';
import { useAppDispatch } from "../../hooks/useRedux";
import { confirmOrder } from '../../redux/slices/OrdersSlice';

// ----------------------------------------------------------------------
export default function GeneralOrders() {
  const { getAccessTokenSilently } = useAuth0();
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const handleConfirmOrder = useCallback(async (id: string) => {
    const token = await getAccessTokenSilently({ authorizationParams: { scope: "write:order" } });
    dispatch(confirmOrder({ orderId: id, additionalMessage: "", token: token }));
  }, [dispatch, getAccessTokenSilently]);
  return (
    <Page title="Order Management">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <OrderManagerComponent handleConfirmOrder={handleConfirmOrder} />
          </Grid>
          <Grid size={12}>
            <OrderCalendar selectOrderById={setSelectedOrderId} />
          </Grid>
        </Grid>
      </Container>
      {selectedOrderId !== null ? <Dialog scroll={'body'} fullWidth maxWidth={'xl'} open={selectedOrderId !== null} onClose={() => setSelectedOrderId(null)}><WOrderComponentCard orderId={selectedOrderId!} handleConfirmOrder={handleConfirmOrder} onCloseCallback={() => setSelectedOrderId(null)} /></Dialog> : ""}
    </Page>
  );
}
