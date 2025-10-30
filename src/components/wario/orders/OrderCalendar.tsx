import { type EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react'; // => request placed at the top
import timeGridPlugin from '@fullcalendar/timegrid';
import timelinePlugin from '@fullcalendar/timeline';
//
import { useEffect, useRef, useState } from 'react';

// @mui
import { Card } from '@mui/material';

// sections
import { useAppSelector } from '../../../hooks/useRedux';
// hooks
import { useResponsive } from '../../../hooks/useResponsive';
import { selectOrdersAsEvents } from '../../../redux/store';

// components
import CalendarStyle, { type CalendarView } from './CalendarStyle';
import CalendarToolbar from './CalendarToolbar';

// ----------------------------------------------------------------------

export interface OrderCalendarProps {
  selectOrderById: (id: string) => void;
}

export function OrderCalendar(props: OrderCalendarProps) {
  const currentTime = useAppSelector(s => s.ws.currentTime);

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
