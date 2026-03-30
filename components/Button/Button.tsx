import styles from "./Button.module.scss";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const sizeClass = size !== "md" ? styles[size] : "";
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
