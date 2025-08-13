export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center 
                 bg-black/40 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white/10 dark:bg-gray-900/30 backdrop-blur-xl 
                   border border-white/10 p-6 rounded-2xl shadow-2xl 
                   max-w-2xl w-full relative animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white 
                     bg-white/10 hover:bg-white/20 rounded-full w-8 h-8 flex items-center 
                     justify-center transition-all duration-200"
        >
          ✕
        </button>
        {children}
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}
