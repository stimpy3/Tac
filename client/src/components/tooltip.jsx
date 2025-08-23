import { useState } from "react";

const Tooltip = ({ children, text }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
         <div className="text-[0.5rem] z-50 absolute bottom-full p-[5px] w-max rounded-lg bg-gray-800 text-white text-sm shadow-lg dark:bg-gray-200 dark:text-black">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;