import { useState } from 'react';

// ----------------------------------------------------------------------

export function useTabs(defaultValues?: string) {
  const [currentTab, setCurrentTab] = useState(defaultValues || '');

  return {
    currentTab,
    onChangeTab: (event: React.SyntheticEvent, newValue: string) => {
      setCurrentTab(newValue);
    },
    setCurrentTab,
  };
}
