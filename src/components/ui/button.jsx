import { forwardRef } from "react";
import PropTypes from "prop-types";

import { cn } from "@/lib/utils";

const variantStyles = {
  default:
    "bg-amber-400 text-amber-950 hover:bg-amber-300 border border-transparent",
  destructive:
    "bg-rose-500 text-white hover:bg-rose-400 border border-transparent",
  outline: "border border-white/20 bg-transparent text-white hover:bg-white/10",
  secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
  ghost:
    "bg-transparent text-white hover:bg-white/10 border border-transparent",
  link: "bg-transparent text-amber-400 underline-offset-4 hover:underline",
};

const sizeStyles = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-11 px-6 text-base",
  icon: "h-9 w-9",
};

export const buttonVariants = ({
  variant = "default",
  size = "default",
} = {}) =>
  cn(
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-400 disabled:pointer-events-none disabled:opacity-50",
    variantStyles[variant] ?? variantStyles.default,
    sizeStyles[size] ?? sizeStyles.default
  );

export const Button = forwardRef(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);

Button.displayName = "Button";

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf([
    "default",
    "destructive",
    "outline",
    "secondary",
    "ghost",
    "link",
  ]),
  size: PropTypes.oneOf(["default", "sm", "lg", "icon"]),
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
  children: PropTypes.node,
};

Button.defaultProps = {
  variant: "default",
  size: "default",
  type: "button",
};
