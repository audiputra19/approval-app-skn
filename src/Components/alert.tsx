import { FC, useEffect } from 'react';
import { useAlert } from '../Contexts/alertContext';

const Alert: FC = () => {
  const { message, visible, hideAlert } = useAlert();

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        hideAlert();
      }, 2000); // Auto close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [visible, hideAlert]);

  // if (!visible) return null;

  return (
    <div
      className={`fixed z-20 left-1/2 transform -translate-x-1/2 bottom-4 py-4 px-5 rounded-full 
        text-sm bg-gray-200 transition-all duration-300 ease-in-out whitespace-nowrap text-black
        ${visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        style={{ display: 'inline-block' }}
    >
      {message}
    </div>
  );
};

export default Alert;
