import { useState } from 'react';

// ----------------------------------------------------------------------

export function useToggle(defaultChecked?: boolean) {
  const [toggle, setToggle] = useState(defaultChecked || false);

  return {
    toggle,
    onToggle: () => setToggle(!toggle),
    onOpen: () => setToggle(true),
    onClose: () => setToggle(false),
    setToggle,
  };
}
