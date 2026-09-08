export default function InputIcon({ children, label, onClick, disabled }) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="text-[#b5bac1] hover:text-[#dbdee1] transition-colors duration-150 hover:scale-110 active:scale-95 disabled:opacity-40 disabled:hover:scale-100"
    >
      {children}
    </button>
  );
}