"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useBookingFlow } from "./booking-flow";
import { isValidRussianPhone } from "./phone";
import { services } from "./services";

type FormStatus = "idle" | "loading" | "success" | "error";
type FormField = "name" | "phone" | "service" | "comment";

type FormValues = {
  name: string;
  phone: string;
  service: string;
  comment: string;
  website: string;
};

type FormErrors = Partial<Record<FormField, string>>;

const initialValues: FormValues = {
  name: "",
  phone: "",
  service: "",
  comment: "",
  website: "",
};

const CLIENT_REQUEST_TIMEOUT_MS = 12_000;
const RUSSIAN_PHONE_LENGTH = 10;
const fieldOrder: FormField[] = ["name", "phone", "service", "comment"];

function getSubscriberDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  const withoutCountryCode =
    digits.startsWith("7") || digits.startsWith("8")
      ? digits.slice(1)
      : digits;

  return withoutCountryCode.slice(0, RUSSIAN_PHONE_LENGTH);
}

function formatRussianPhone(value: string, previousValue: string) {
  const hasDigits = /\d/.test(value);

  if (!hasDigits) {
    return "";
  }

  let subscriberDigits = getSubscriberDigits(value);
  const previousSubscriberDigits = getSubscriberDigits(previousValue);

  if (
    value.length < previousValue.length &&
    subscriberDigits.length === previousSubscriberDigits.length
  ) {
    subscriberDigits = subscriberDigits.slice(0, -1);
  }

  let formatted = "+7";

  if (subscriberDigits.length > 0) {
    formatted += ` (${subscriberDigits.slice(0, 3)}`;
  }

  if (subscriberDigits.length >= 3) {
    formatted += ")";
  }

  if (subscriberDigits.length > 3) {
    formatted += ` ${subscriberDigits.slice(3, 6)}`;
  }

  if (subscriberDigits.length > 6) {
    formatted += `-${subscriberDigits.slice(6, 8)}`;
  }

  if (subscriberDigits.length > 8) {
    formatted += `-${subscriberDigits.slice(8, 10)}`;
  }

  return formatted;
}

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  const name = values.name.trim();
  const phone = values.phone.trim();
  const comment = values.comment.trim();

  if (!name) {
    errors.name = "Укажите, как к вам обращаться.";
  } else if (name.length < 2) {
    errors.name = "Имя должно содержать хотя бы 2 символа.";
  } else if (name.length > 80) {
    errors.name = "Сократите имя до 80 символов.";
  }

  if (!phone) {
    errors.phone = "Оставьте номер для подтверждения записи.";
  } else if (phone.length > 30) {
    errors.phone = "Сократите номер до 30 символов.";
  } else if (!isValidRussianPhone(phone)) {
    errors.phone = "Проверьте российский формат номера.";
  }

  if (!values.service) {
    errors.service = "Выберите услугу.";
  }

  if (comment.length > 600) {
    errors.comment = "Сократите комментарий до 600 символов.";
  }

  return errors;
}

function isSuccessResponse(value: unknown): value is { ok: true } {
  return (
    typeof value === "object" &&
    value !== null &&
    "ok" in value &&
    value.ok === true
  );
}

export default function LeadForm() {
  const {
    selectedService,
    selectionRevision,
    isHighlighting,
    clearSelectedService,
  } = useBookingFlow();
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusRevision, setStatusRevision] = useState(0);
  const isSubmittingRef = useRef(false);
  const latestSelectionRevisionRef = useRef(selectionRevision);

  useEffect(() => {
    latestSelectionRevisionRef.current = selectionRevision;
  }, [selectionRevision]);
  const effectiveStatus =
    status === "loading"
      ? "loading"
      : selectionRevision > statusRevision
        ? "idle"
        : status;
  const formValues = {
    ...values,
    service: selectedService ?? values.service,
  };

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    const field = name as keyof FormValues;
    const nextValue =
      field === "phone" ? formatRussianPhone(value, values.phone) : value;

    if (field === "service") {
      clearSelectedService();
    }

    setValues((current) => ({ ...current, [field]: nextValue }));
    setErrors((current) => ({ ...current, [field]: undefined }));

    if (status === "success" || status === "error") {
      setStatus("idle");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    const nextErrors = validateForm(formValues);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("idle");

      const firstInvalidField = fieldOrder.find((field) => nextErrors[field]);

      if (firstInvalidField) {
        window.requestAnimationFrame(() => {
          document.getElementById(firstInvalidField)?.focus();
        });
      }

      return;
    }

    setErrors({});
    setStatusRevision(selectionRevision);
    setStatus("loading");
    isSubmittingRef.current = true;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(
      () => controller.abort(),
      CLIENT_REQUEST_TIMEOUT_MS,
    );

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formValues.name.trim(),
          phone: formValues.phone.trim(),
          service: formValues.service,
          comment: formValues.comment.trim() || undefined,
          website: formValues.website,
        }),
        signal: controller.signal,
      });

      const result: unknown = await response.json().catch(() => null);

      if (!response.ok || !isSuccessResponse(result)) {
        setStatusRevision(latestSelectionRevisionRef.current);
        setStatus("error");
        return;
      }

      setValues(initialValues);
      clearSelectedService();
      setStatusRevision(latestSelectionRevisionRef.current);
      setStatus("success");
    } catch {
      setStatusRevision(latestSelectionRevisionRef.current);
      setStatus("error");
    } finally {
      window.clearTimeout(timeoutId);
      isSubmittingRef.current = false;
    }
  }

  const inputClassName =
    "h-11 w-full border border-white/15 bg-[#171512] px-3 text-base sm:px-4 text-[#f1e9da] outline-none transition-[border-color,background-color,opacity] placeholder:text-[#928a7f] hover:border-white/30 focus:border-[#caa36b] focus:bg-[#1b1814] disabled:cursor-not-allowed disabled:opacity-60";
  const fieldClassName = "transition-opacity";

  return (
    <div
      id="lead-form"
      className={`booking-form animate-premium-form scroll-mt-20 border sm:scroll-mt-24 bg-[#201d19] p-1.5 sm:p-2 transition-[border-color,background-color] ${
        isHighlighting
          ? "border-[#d5b075] bg-[#252019] is-highlighting"
          : "border-[#8c6c42]"
      }`}
    >
      <div className="booking-form-inner border border-white/10 p-4 sm:p-6 lg:p-5">
        <div className="flex items-start justify-between gap-3 sm:gap-5">
          <div>
            <p className="text-xs font-bold uppercase text-[#b79058]">
              Онлайн-запись
            </p>
            <h2 className="booking-form-title font-display mt-2 text-2xl font-black uppercase leading-[1.02] text-[#f1e9da] sm:text-3xl sm:leading-none">
              Запишитесь на удобное время
            </h2>
          </div>
          <span className="mt-1 h-3 w-3 shrink-0 bg-[#722f36]" aria-hidden="true" />
        </div>

        <p className="booking-form-copy mt-2 max-w-sm text-sm leading-5 text-[#aaa094] sm:mt-3 sm:leading-6 lg:mt-2 lg:leading-5">
          Оставьте контакты — администратор предложит свободное время и
          подтвердит запись.
        </p>
        <p className="booking-form-trust mt-3 flex items-start gap-2 text-[0.7rem] leading-4 sm:mt-4 sm:items-center sm:text-xs lg:mt-3 font-bold text-[#d8c7ad]">
          <span className="h-1.5 w-1.5 bg-[#b79058]" aria-hidden="true" />
          Ответим в течение 15 минут в рабочее время
        </p>

        <form
          className="booking-form-fields mt-5 sm:mt-5"
          onSubmit={handleSubmit}
          noValidate
          aria-busy={effectiveStatus === "loading"}
        >
          <div className="honeypot-field" aria-hidden="true">
            <label htmlFor="website">Не заполняйте это поле</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={handleChange}
            />
          </div>

          <div className={fieldClassName}>
            <label className="mb-1.5 block text-[0.7rem] font-bold uppercase sm:mb-2 sm:text-xs text-[#c9c0b2]" htmlFor="name">
              Ваше имя
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Например, Алексей"
              maxLength={80}
              value={values.name}
              onChange={handleChange}
              disabled={effectiveStatus === "loading"}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={inputClassName}
            />
            {errors.name && <p id="name-error" className="mt-2 text-xs text-[#e4a4a9]">{errors.name}</p>}
          </div>

          <div className={fieldClassName}>
            <label className="mb-2 block text-xs font-bold uppercase text-[#c9c0b2]" htmlFor="phone">
              Телефон
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="+7 (999) 123-45-67"
              maxLength={30}
              value={values.phone}
              onChange={handleChange}
              disabled={effectiveStatus === "loading"}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={inputClassName}
            />
            {errors.phone && <p id="phone-error" className="mt-2 text-xs text-[#e4a4a9]">{errors.phone}</p>}
          </div>

          <div id="service-field" className={`${fieldClassName} scroll-mt-24`}>
            <label className="mb-2 block text-xs font-bold uppercase text-[#c9c0b2]" htmlFor="service">
              Услуга
            </label>
            <select
              id="service"
              name="service"
              value={selectedService ?? values.service}
              onChange={handleChange}
              disabled={effectiveStatus === "loading"}
              aria-invalid={Boolean(errors.service)}
              aria-describedby={errors.service ? "service-error" : undefined}
              className={`${inputClassName} appearance-none bg-[linear-gradient(45deg,transparent_50%,#b79058_50%),linear-gradient(135deg,#b79058_50%,transparent_50%)] bg-[position:calc(100%-18px)_21px,calc(100%-13px)_21px] bg-[size:5px_5px,5px_5px] bg-no-repeat pr-10`}
            >
              <option value="">Выберите из списка</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title} — {service.price}
                </option>
              ))}
            </select>
            {errors.service && !selectedService && <p id="service-error" className="mt-2 text-xs text-[#e4a4a9]">{errors.service}</p>}
          </div>

          <div className={fieldClassName}>
            <label className="mb-2 block text-xs font-bold uppercase text-[#c9c0b2]" htmlFor="comment">
              Комментарий <span className="font-normal text-[#928a7f]">необязательно</span>
            </label>
            <textarea
              id="comment"
              name="comment"
              rows={3}
              placeholder="Например, удобно после 18:00"
              maxLength={600}
              value={values.comment}
              onChange={handleChange}
              disabled={effectiveStatus === "loading"}
              aria-invalid={Boolean(errors.comment)}
              aria-describedby={errors.comment ? "comment-error" : undefined}
              className={`${inputClassName} booking-form-textarea min-h-20 resize-y py-2.5`}
            />
            {errors.comment && <p id="comment-error" className="mt-2 text-xs text-[#e4a4a9]">{errors.comment}</p>}
          </div>

          <button
            type="submit"
            disabled={effectiveStatus === "loading"}
            className="form-submit flex h-12 w-full items-center justify-center gap-3 bg-[#c29a61] px-6 text-sm font-bold uppercase text-[#171512] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8b579] active:translate-y-0 disabled:cursor-wait disabled:translate-y-0 disabled:bg-[#766347] disabled:text-[#2a241c] sm:h-[3.25rem] lg:h-12"
          >
            {effectiveStatus === "loading" ? "Отправляем..." : "Оставить заявку"}
            <span className="form-submit-arrow" aria-hidden="true">→</span>
          </button>

          <div className="booking-form-status flex h-28 items-center border border-white/10 bg-[#181613] px-3 py-2 sm:h-24 sm:px-4 lg:h-[6.5rem] lg:px-3" aria-live="polite">
            {effectiveStatus === "success" && (
              <div className="animate-status-fade-in border-l-2 border-[#b79058] pl-3">
                <p className="text-sm font-bold text-[#f1e9da]">Заявка отправлена</p>
                <p className="mt-1 text-xs leading-5 text-[#aaa094]">Администратор получил уведомление в Telegram и скоро свяжется с вами.</p>
              </div>
            )}
            {effectiveStatus === "error" && (
              <div role="alert" className="animate-status-fade-in border-l-2 border-[#c66f77] pl-3">
                <p className="text-sm font-bold text-[#f0c8cb]">Не удалось отправить заявку</p>
                <p className="mt-1 text-xs leading-5 text-[#bda5a2]">Проверьте данные или попробуйте позже.</p>
              </div>
            )}
            {effectiveStatus === "loading" && (
              <div className="animate-status-fade-in border-l-2 border-[#b79058] pl-3">
                <p className="text-sm font-bold text-[#f1e9da]">Передаём заявку</p>
                <p className="mt-1 text-xs leading-5 text-[#aaa094]">Это займёт всего несколько секунд.</p>
              </div>
            )}
            {effectiveStatus === "idle" && (
              <p className="animate-status-fade-in text-xs leading-5 text-[#928a7f]">
                Нажимая кнопку, вы соглашаетесь на обработку данных для записи.
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
