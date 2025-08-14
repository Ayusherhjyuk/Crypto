import { useEffect, useState } from "react";

export default function Loader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000); // 3 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="w-16 h-16 rounded-full border-4 border-transparent animate-spin 
        bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 
        shadow-[0_0_25px_rgba(59,130,246,0.7),0_0_35px_rgba(236,72,153,0.5)]
        [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)] 
        [mask-composite:exclude] p-[2px]">
      </div>
    </div>
  );
}
