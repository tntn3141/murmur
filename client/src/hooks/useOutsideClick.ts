import { useEffect, useRef } from 'react';

// Usage example:
// 1 - Initiate the hook:
// const wrapperRef = useRef(null);
// useOutsideClick(callback, wrapperRef);
// 2 - Add attribute ref={wrapperRef} to the element that needs tracking clicks outside of it:
// <div ref={wrapperRef}> ... </div>

// Invoke callback when detecting clicks outside the element with ref

export const useOutsideClick = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [callback]);

  return ref;
};