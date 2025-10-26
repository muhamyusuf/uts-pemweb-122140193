import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence, MotionConfig } from "motion/react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import useClickOutside from "@/hooks/use-click-outside";

const MorphingDialogContext = React.createContext(null);

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext);
  if (!context) {
    throw new Error(
      "useMorphingDialog must be used within a MorphingDialogProvider"
    );
  }
  return context;
}

function MorphingDialogProvider({ children, transition }) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();
  const triggerRef = useRef(null);

  const contextValue = useMemo(
    () => ({
      isOpen,
      setIsOpen,
      uniqueId,
      triggerRef,
    }),
    [isOpen, uniqueId]
  );

  return (
    <MorphingDialogContext.Provider value={contextValue}>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </MorphingDialogContext.Provider>
  );
}

MorphingDialogProvider.propTypes = {
  children: PropTypes.node.isRequired,
  transition: PropTypes.object,
};

function MorphingDialog({ children, transition }) {
  return (
    <MorphingDialogProvider transition={transition}>
      <MotionConfig transition={transition}>{children}</MotionConfig>
    </MorphingDialogProvider>
  );
}

MorphingDialog.propTypes = {
  children: PropTypes.node.isRequired,
  transition: PropTypes.object,
};

function MorphingDialogTrigger({ children, className, style }) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useMorphingDialog();

  const handleClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen, setIsOpen]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setIsOpen(!isOpen);
      }
    },
    [isOpen, setIsOpen]
  );

  return (
    <motion.button
      ref={triggerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn("relative cursor-pointer", className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={style}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={`motion-ui-morphing-dialog-content-${uniqueId}`}
      aria-label={`Open dialog ${uniqueId}`}
    >
      {children}
    </motion.button>
  );
}

MorphingDialogTrigger.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

function MorphingDialogContent({ children, className, style }) {
  const { setIsOpen, isOpen, uniqueId, triggerRef } = useMorphingDialog();
  const containerRef = useRef(null);
  const [firstFocusableElement, setFirstFocusableElement] = useState(null);
  const [lastFocusableElement, setLastFocusableElement] = useState(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }

      if (event.key === "Tab") {
        if (!firstFocusableElement || !lastFocusableElement) {
          return;
        }

        if (event.shiftKey) {
          if (document.activeElement === firstFocusableElement) {
            event.preventDefault();
            lastFocusableElement.focus();
          }
        } else if (document.activeElement === lastFocusableElement) {
          event.preventDefault();
          firstFocusableElement.focus();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [firstFocusableElement, isOpen, lastFocusableElement, setIsOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const element = containerRef.current;
    if (!element) {
      return;
    }

    const nodes = element.querySelectorAll(
      "a[href], button:not([disabled]), textarea, input, select"
    );
    setFirstFocusableElement(nodes[0] ?? null);
    setLastFocusableElement(nodes[nodes.length - 1] ?? null);

    element.focus();

    return () => {
      setFirstFocusableElement(null);
      setLastFocusableElement(null);
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    triggerRef.current?.focus();
  }, [setIsOpen, triggerRef]);

  useClickOutside(containerRef, () => {
    if (isOpen) {
      handleClose();
    }
  });

  const content = (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={containerRef}
            className={cn("relative w-full max-w-3xl outline-none", className)}
            layoutId={`dialog-${uniqueId}`}
            role="dialog"
            aria-modal="true"
            id={`motion-ui-morphing-dialog-content-${uniqueId}`}
            tabIndex={-1}
            style={style}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full bg-white/80 p-1.5 text-zinc-600 shadow-lg backdrop-blur transition hover:bg-white"
              aria-label="Close dialog"
            >
              <XIcon className="h-4 w-4" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

MorphingDialogContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

function MorphingDialogContainer({ children, className }) {
  const { uniqueId } = useMorphingDialog();
  return (
    <motion.div
      layoutId={`dialog-container-${uniqueId}`}
      className={cn("relative", className)}
    >
      {children}
    </motion.div>
  );
}

MorphingDialogContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

function MorphingDialogClose({ children, className, variants }) {
  const { setIsOpen, uniqueId } = useMorphingDialog();

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  return (
    <motion.button
      onClick={handleClose}
      type="button"
      aria-label="Close dialog"
      key={`dialog-close-${uniqueId}`}
      className={cn("absolute top-6 right-6", className)}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      {children || <XIcon size={24} />}
    </motion.button>
  );
}

MorphingDialogClose.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variants: PropTypes.object,
};

function MorphingDialogTitle({ children, className }) {
  const { uniqueId } = useMorphingDialog();
  return (
    <motion.h2
      layoutId={`dialog-title-${uniqueId}`}
      className={cn("text-2xl font-semibold", className)}
    >
      {children}
    </motion.h2>
  );
}

MorphingDialogTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

function MorphingDialogSubtitle({ children, className, style }) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.div
      layoutId={`dialog-subtitle-container-${uniqueId}`}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

MorphingDialogSubtitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
};

function MorphingDialogDescription({
  children,
  className,
  variants,
  disableLayoutAnimation,
}) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.div
      key={`dialog-description-${uniqueId}`}
      layoutId={
        disableLayoutAnimation
          ? undefined
          : `dialog-description-content-${uniqueId}`
      }
      variants={variants}
      className={className}
      initial="initial"
      animate="animate"
      exit="exit"
      id={`dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}

MorphingDialogDescription.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disableLayoutAnimation: PropTypes.bool,
  variants: PropTypes.object,
};

function MorphingDialogImage({ src, alt, className, style, ...rest }) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.img
      src={src}
      alt={alt}
      className={cn(className)}
      layoutId={`dialog-img-${uniqueId}`}
      style={style}
      {...rest}
    />
  );
}

MorphingDialogImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  onLoad: PropTypes.func,
};

export {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogDescription,
  MorphingDialogImage,
  useMorphingDialog,
};
