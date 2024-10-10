
import { LoaderCircle } from "lucide-react";
import { FC, useEffect, useRef } from "react";

const Loading: FC = () => {
  const spinValue = useRef<number>(0);

  useEffect(() => {
    const spin = () => {
      spinValue.current = 0;
      const interval = setInterval(() => {
        spinValue.current += 0.01;
        if (spinValue.current >= 1) spinValue.current = 0;
      }, 20);
      return () => clearInterval(interval);
    };
    spin();
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white dark:bg-dark-main">
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="animate-spin text-gray-700 dark:text-white">
          <LoaderCircle size={32}/>
        </div>
        <div className="text-sm text-gray-700 flex items-center dark:text-white">
          <p className="animate-pulsing">Memuat</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
