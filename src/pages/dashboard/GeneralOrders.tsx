// @mui
import { Container, DialogTitle, Grid } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import OrderManagerComponent from '../../components/wario/orders/OrderManager';
import { DialogAnimate } from '../../components/animate';
import { WOrderComponentCard } from '../../components/wario/orders/WOrderComponentCard';
import { useAppDispatch, useAppSelector } from "../../hooks/useRedux";
import { confirmOrder, getWOrderInstanceById, OrdersActions } from '../../redux/slices/OrdersSlice';
import OrderCalendar from '../../components/wario/orders/OrderCalendar';
import { useCallback, useState } from 'react';
import { WOrderInstance } from '@wcp/wcpshared';
import { useAuth0 } from '@auth0/auth0-react';

// ----------------------------------------------------------------------
export default function GeneralTiming() {
  const { getAccessTokenSilently } = useAuth0();
  const { themeStretch } = useSettings();
  const dispatch = useAppDispatch();
  const getOrderById = useAppSelector(s => (id: string) => getWOrderInstanceById(s.orders.orders, id));
  const [selectedOrder, setSelectedOrder] = useState<WOrderInstance | null>(null);

  const selectOrderById = useCallback((orderId: string) => {
    const order = getOrderById(orderId);
    if (order) {
      setSelectedOrder(order)
    }
  }, [getOrderById, setSelectedOrder]);

  const handleConfirmOrder = async (id: string) => {
    const token = await getAccessTokenSilently({ scope: "write:order" });
    dispatch(confirmOrder({ orderId: id, additionalMessage: "", token: token }));
  }

  return (
    <Page title="Order Management">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <OrderManagerComponent />
          </Grid>
          <Grid item xs={12}>
            <OrderCalendar selectOrderById={selectOrderById} />
          </Grid>
        </Grid>
      </Container>
      <DialogAnimate fullWidth maxWidth={'xl'} open={selectedOrder !== null} onClose={() => setSelectedOrder(null)}>
        {selectedOrder !== null &&
          <WOrderComponentCard order={selectedOrder} onCloseCallback={() => setSelectedOrder(null)} />
        }
      </DialogAnimate>
    </Page>
  );
}
