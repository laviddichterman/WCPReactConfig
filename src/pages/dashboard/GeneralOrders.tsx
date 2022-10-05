// @mui
import { Container, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import OrderManagerComponent from '../../components/wario/orders/OrderManager';
import { DialogAnimate } from '../../components/animate';
import { WOrderComponentCard } from '../../components/wario/orders/WOrderComponentCard';
import { useAppDispatch } from "../../hooks/useRedux";
import { confirmOrder } from '../../redux/slices/OrdersSlice';
import OrderCalendar from '../../components/wario/orders/OrderCalendar';
import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// ----------------------------------------------------------------------
export default function GeneralTiming() {
  const { getAccessTokenSilently } = useAuth0();
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const handleConfirmOrder = async (id: string) => {
    const token = await getAccessTokenSilently({ scope: "write:order" });
    dispatch(confirmOrder({ orderId: id, additionalMessage: "", token: token }));
  }

  return (
    <Page title="Order Management">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <OrderManagerComponent handleConfirmOrder={handleConfirmOrder} />
          </Grid>
          <Grid item xs={12}>
            <OrderCalendar selectOrderById={setSelectedOrderId} />
          </Grid>
        </Grid>
      </Container>
      <DialogAnimate scroll={'body'} fullWidth maxWidth={'xl'} open={selectedOrderId !== null} onClose={() => setSelectedOrderId(null)}>
          <WOrderComponentCard orderId={selectedOrderId!} handleConfirmOrder={handleConfirmOrder} onCloseCallback={() => setSelectedOrderId(null)} />
      </DialogAnimate>
    </Page>
  );
}
