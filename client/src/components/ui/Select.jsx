export default function Select({ children, className = "", ...props }) {
  return (
    <select
      {...props}
      className={`w-full px-3 py-2 rounded-lg border 
      border-gray-300 dark:border-gray-700 
      bg-white dark:bg-gray-800 
      text-gray-900 dark:text-gray-100 
      focus:ring-2 focus:ring-green-500 outline-none ${className}`}
    >
      {children}
    </select>
  );
}