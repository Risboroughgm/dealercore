interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  onClick?: () => void;
}

export default function Button({
  children,
  variant = "primary",
  onClick,
}: ButtonProps) {
  const styles = {
    primary:
      "bg-green-500 hover:bg-green-600 text-white",

    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-800",

    danger:
      "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      onClick={onClick}
      className={`
        rounded-xl
        px-5
        py-3
        font-semibold
        transition
        duration-200
        shadow-sm
        ${styles[variant]}
      `}
    >
      {children}
    </button>
  );
}