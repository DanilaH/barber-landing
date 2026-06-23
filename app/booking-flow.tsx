"use client";

import {
  createContext,
  MouseEvent as ReactMouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ServiceId } from "./services";

type FormFocusTarget = "name" | "service" | false;
type FormScrollMode = "auto" | "if-needed";

type ActivateFormOptions = {
  focus?: FormFocusTarget;
  scroll?: FormScrollMode;
};

type BookingContextValue = {
  selectedService: ServiceId | null;
  selectionRevision: number;
  isHighlighting: boolean;
  activateForm: (options?: ActivateFormOptions) => void;
  selectService: (serviceId: ServiceId) => void;
  clearSelectedService: () => void;
};

type BookingCtaProps = {
  children: ReactNode;
  className: string;
  focus?: FormFocusTarget;
  scroll?: FormScrollMode;
};

const BookingContext = createContext<BookingContextValue | null>(null);
const FORM_TOP_GAP = 20;
const HIGHLIGHT_DURATION_MS = 850;

function getActiveHeaderOffset() {
  const header = document.querySelector<HTMLElement>("[data-site-header]");

  if (!header) {
    return 0;
  }

  const position = window.getComputedStyle(header).position;

  return position === "fixed" || position === "sticky"
    ? header.getBoundingClientRect().height
    : 0;
}

export function BookingFlow({ children }: { children: ReactNode }) {
  const [selectedService, setSelectedService] = useState<ServiceId | null>(null);
  const [selectionRevision, setSelectionRevision] = useState(0);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const highlightTimeoutRef = useRef<number | null>(null);
  const activationFallbackRef = useRef<number | null>(null);
  const scrollEndHandlerRef = useRef<(() => void) | null>(null);

  const clearPendingActivation = useCallback(() => {
    if (activationFallbackRef.current) {
      window.clearTimeout(activationFallbackRef.current);
      activationFallbackRef.current = null;
    }

    if (scrollEndHandlerRef.current) {
      window.removeEventListener("scrollend", scrollEndHandlerRef.current);
      scrollEndHandlerRef.current = null;
    }
  }, []);

  const activateForm = useCallback(
    ({ focus = "name", scroll = "if-needed" }: ActivateFormOptions = {}) => {
      const form = document.getElementById("lead-form");

      if (!form) {
        return;
      }

      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }

      clearPendingActivation();
      setIsHighlighting(false);

      window.requestAnimationFrame(() => {
        const prefersReducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        const headerOffset = getActiveHeaderOffset();
        const topOffset = headerOffset + FORM_TOP_GAP;
        const formRect = form.getBoundingClientRect();
        const comfortableBottom = Math.max(
          topOffset,
          window.innerHeight * 0.4,
        );
        const formTopIsComfortable =
          formRect.top >= topOffset && formRect.top <= comfortableBottom;

        const shouldScroll = scroll === "auto" || !formTopIsComfortable;
        let activationCompleted = false;

        const completeActivation = () => {
          if (activationCompleted) {
            return;
          }

          activationCompleted = true;
          clearPendingActivation();
          setIsHighlighting(true);

          if (focus) {
            window.requestAnimationFrame(() => {
              document
                .getElementById(focus)
                ?.focus({ preventScroll: true });
            });
          }

          highlightTimeoutRef.current = window.setTimeout(
            () => setIsHighlighting(false),
            HIGHLIGHT_DURATION_MS,
          );
        };

        if (shouldScroll) {
          const targetTop = Math.max(
            0,
            formRect.top + window.scrollY - topOffset,
          );

          if (prefersReducedMotion) {
            window.scrollTo({ top: targetTop, behavior: "auto" });
            window.requestAnimationFrame(completeActivation);
          } else {
            const handleScrollEnd = () => completeActivation();
            scrollEndHandlerRef.current = handleScrollEnd;
            window.addEventListener("scrollend", handleScrollEnd, { once: true });
            activationFallbackRef.current = window.setTimeout(
              completeActivation,
              900,
            );
            window.scrollTo({ top: targetTop, behavior: "smooth" });
          }
        } else {
          window.requestAnimationFrame(completeActivation);
        }
      });
    },
    [clearPendingActivation],
  );

  const selectService = useCallback(
    (serviceId: ServiceId) => {
      setSelectedService(serviceId);
      setSelectionRevision((revision) => revision + 1);
      activateForm({ focus: "name", scroll: "if-needed" });
    },
    [activateForm],
  );

  const clearSelectedService = useCallback(() => {
    setSelectedService(null);
    setIsHighlighting(false);
  }, []);

  useEffect(
    () => () => {
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }

      clearPendingActivation();
    },
    [clearPendingActivation],
  );

  const value = useMemo(
    () => ({
      selectedService,
      selectionRevision,
      isHighlighting,
      activateForm,
      selectService,
      clearSelectedService,
    }),
    [
      selectedService,
      selectionRevision,
      isHighlighting,
      activateForm,
      selectService,
      clearSelectedService,
    ],
  );

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}

export function BookingCta({
  children,
  className,
  focus = "name",
  scroll = "if-needed",
}: BookingCtaProps) {
  const { activateForm } = useBookingFlow();

  function handleClick(event: ReactMouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    activateForm({ focus, scroll });
  }

  return (
    <a href="#lead-form" className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

export function ServiceSelectButton({
  serviceId,
}: {
  serviceId: ServiceId;
}) {
  const { selectService } = useBookingFlow();

  return (
    <button
      type="button"
      onClick={() => selectService(serviceId)}
      className="service-select mt-3 inline-flex min-h-11 items-center sm:mt-6 sm:min-h-0 lg:mt-4 gap-2 text-xs font-bold uppercase text-[#76532e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#722f36]"
    >
      Выбрать услугу <span aria-hidden="true">→</span>
    </button>
  );
}

export function useBookingFlow() {
  const context = useContext(BookingContext);

  if (!context) {
    throw new Error("useBookingFlow must be used inside BookingFlow");
  }

  return context;
}
