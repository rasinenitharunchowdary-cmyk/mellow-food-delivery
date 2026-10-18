import { useEffect, useId, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { MAX_QUANTITY } from "../lib/commerce";

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Mellow home">
      <span className="brand-mark">
        <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path d="M7 18h26c0 10-5 16-13 16S7 28 7 18Z" fill="currentColor" />
          <path
            d="M13 11c-2-3 3-4 1-7m6 8c-2-3 3-4 1-7m6 6c-2-3 3-4 1-7"
            stroke="currentColor"
            strokeWidth="2.3"
            strokeLinecap="round"
          />
        </svg>
      </span>
      mellow<span className="brand-dot">.</span>
    </Link>
  );
}

export function Modal({ open, onClose, title, children, className = "" }) {
  const labelId = useId();
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = setTimeout(
      () =>
        ref.current
          ?.querySelector("button, input, a, select, textarea")
          ?.focus(),
      50,
    );
    function onKey(event) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const elements = [
          ...(ref.current?.querySelectorAll(
            'button:not(:disabled), [href], input:not(:disabled), select, textarea, [tabindex="0"]',
          ) || []),
        ].filter((e) => e.offsetParent !== null);
        const first = elements[0],
          last = elements.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focusTimer);
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`modal-layer ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.section
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            className="modal glass"
            initial={{ y: 30, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="modal-heading">
              <h2 id={labelId}>{title}</h2>
              <button
                className="icon-button"
                onClick={onClose}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>
            {children}
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Quantity({ quantity, onChange, name = "item" }) {
  return (
    <div className="quantity">
      <button
        onClick={() => onChange(quantity - 1)}
        aria-label={`Decrease ${name} quantity`}
      >
        <Minus size={15} />
      </button>
      <span aria-live="polite">{quantity}</span>
      <button
        disabled={quantity >= MAX_QUANTITY}
        onClick={() => onChange(quantity + 1)}
        aria-label={`Increase ${name} quantity`}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
export function VegMark({ veg }) {
  return (
    <span
      className={`veg-mark ${veg ? "veg" : "nonveg"}`}
      aria-label={veg ? "Vegetarian" : "Non-vegetarian"}
    >
      <span />
    </span>
  );
}
export function EmptyState({
  icon: Icon,
  title,
  description,
  action = "Explore restaurants",
  to = "/",
}) {
  return (
    <div className="empty-state clay">
      <span className="empty-icon">
        <Icon size={40} strokeWidth={1.5} />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <Link className="button primary" to={to}>
        {action}
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
export function StepHeading({ eyebrow, title, description }) {
  return (
    <div className="page-heading">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
export function CheckIcon() {
  return (
    <span className="check-icon">
      <Check size={14} />
    </span>
  );
}
