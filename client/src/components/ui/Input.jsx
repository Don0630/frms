import { forwardRef } from "react";

const Input = forwardRef(({ icon, className = "", ...props }, ref) => {
  return (
    <div
      className={`flex items-center w-full px-3 py-2 rounded-lg border 
      border-gray-300 dark:border-gray-700 
      bg-white dark:bg-gray-800 
      focus-within:ring-2 focus-within:ring-green-500 ${className}`}
    >
      {icon && <span className="mr-2 text-gray-400">{icon}</span>}

      <input
        ref={ref}
        {...props}
        className="w-full outline-none bg-transparent text-gray-900 dark:text-gray-100"
      />
    </div>
  );
});

export default Input;