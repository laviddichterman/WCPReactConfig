import FullCalendar, { DateSelectArg, EventClickArg, EventDropArg } from '@fullcalendar/react'; // => request placed at the top
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
import interactionPlugin, { EventResizeDoneArg } from '@fullcalendar/interaction';
//
import { useState, useRef, useEffect } from 'react';
// @mui
import { Card, Button, Container, DialogTitle } from '@mui/material';
// redux

import {
  getWOrderInstances,
  OrdersActions
} from '../../../redux/slices/OrdersSlice';
// hooks
import useSettings from '../../../hooks/useSettings';
import useResponsive from '../../../hooks/useResponsive';
// components
import CalendarStyle, { CalendarView } from './CalendarStyle';
// sections
import { useAppDispatch, useAppSelector } from '../../../hooks/useRedux';
import { RootState, selectOrdersAsEvents } from '../../../redux/store';
import CalendarToolbar from './CalendarToolbar';

// ----------------------------------------------------------------------

export interface OrderCalendarProps {
  selectOrderById: (id: string) => void;
}

export default function OrderCalendar(props: OrderCalendarProps) {
  const { themeStretch } = useSettings();
  const currentTime = useAppSelector(s=>s.ws.currentTime);

  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectOrdersAsEvents);

  const isDesktop = useResponsive('up', 'sm');

  const calendarRef = useRef<FullCalendar>(null);

  const [date, setDate] = useState(currentTime);

  const [view, setView] = useState<CalendarView>('listWeek');

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = 'listWeek';
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isDesktop]);

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate().valueOf());
    }
  };

  const handleChangeView = (newView: CalendarView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate().valueOf());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate().valueOf());
    }
  };

  const handleSelectEvent = (arg: EventClickArg) => {
    props.selectOrderById(arg.event.id);
  };

  return (
      <Card>
        <CalendarStyle>
          <CalendarToolbar
            date={date}
            view={view}
            onNextDate={handleClickDateNext}
            onPrevDate={handleClickDatePrev}
            onToday={handleClickToday}
            onChangeView={handleChangeView}
          />
          <FullCalendar
            weekends
            selectable
            //eventDataTransform={()}
            events={orders}
            ref={calendarRef}
            rerenderDelay={10}
            initialDate={date}
            initialView={view}
            dayMaxEventRows={3}
            eventDisplay="block"
            headerToolbar={false}
            allDayMaintainDuration
            eventClick={handleSelectEvent}
            height={isDesktop ? 720 : 'auto'}
            plugins={[
              
              listPlugin,
              dayGridPlugin,
              timelinePlugin,
              timeGridPlugin,
            ]}
          />
        </CalendarStyle>
      </Card>
  );
}
