"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type ServiceId =
  | "haircut"
  | "haircut-beard"
  | "beard-care"
  | "kids";

type BookingContextValue = {
  selectedService: ServiceId | null;
  selectionRevision: number;
  isHighlighting: boolean;
  selectService: (serviceId: ServiceId) => void;
  clearSelectedService: () => void;
};

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingFlow({ children }: { children: ReactNode }) {
  const [selectedService, setSelectedService] = useState<ServiceId | null>(null);
  const [selectionRevision, setSelectionRevision] = useState(0);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const highlightTimeoutRef = useRef<number | null>(null);

  const selectService = useCallback((serviceId: ServiceId) => {
    setSelectedService(serviceId);
    setSelectionRevision((revision) => revision + 1);
    setIsHighlighting(false);

    if (highlightTimeoutRef.current) {
      window.clearTimeout(highlightTimeoutRef.current);
    }

    window.requestAnimationFrame(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      setIsHighlighting(true);
      document.getElementById("service-field")?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });

      highlightTimeoutRef.current = window.setTimeout(
        () => setIsHighlighting(false),
        850,
      );
    });
  }, []);

  const clearSelectedService = useCallback(() => {
    setSelectedService(null);
    setIsHighlighting(false);
  }, []);

  useEffect(
    () => () => {
      if (highlightTimeoutRef.current) {
        window.clearTimeout(highlightTimeoutRef.current);
      }
    },
    [],
  );

  const value = useMemo(
    () => ({
      selectedService,
      selectionRevision,
      isHighlighting,
      selectService,
      clearSelectedService,
    }),
    [
      selectedService,
      selectionRevision,
      isHighlighting,
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