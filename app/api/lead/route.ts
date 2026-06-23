import { isValidRussianPhone, normalizeRussianPhone } from "@/app/phone";
import {
  isServiceId,
  serviceNames,
  type ServiceId,
} from "@/app/services";

type LeadPayload = {
  name: string;
  phone: string;
  service: ServiceId;
  comment?: string;
  website?: string;
};

const TELEGRAM_REQUEST_TIMEOUT_MS = 8_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateLead(value: unknown): LeadPayload | null {
  if (!isRecord(value)) {
    return null;
  }

  const { name, phone, service, comment, website } = value;

  if (typeof name !== "string" || typeof phone !== "string") {
    return null;
  }

  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();
  const normalizedPhone = normalizeRussianPhone(trimmedPhone);

  if (!trimmedName || trimmedName.length > 80) {
    return null;
  }

  if (!isValidRussianPhone(trimmedPhone) || !normalizedPhone) {
    return null;
  }

  if (!isServiceId(service)) {
    return null;
  }

  if (comment !== undefined && typeof comment !== "string") {
    return null;
  }

  if (website !== undefined && typeof website !== "string") {
    return null;
  }

  const trimmedComment = comment?.trim();

  if (trimmedComment && trimmedComment.length > 600) {
    return null;
  }

  return {
    name: trimmedName,
    phone: normalizedPhone,
    service,
    comment: trimmedComment || undefined,
    website: website?.trim() || undefined,
  };
}

function escapeHtml(value: string) {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return value.replace(/[&<>"']/g, (character) => entities[character]);
}

function errorResponse(status: number) {
  return Response.json({ ok: false }, { status });
}

export async function POST(request: Request) {
  let requestBody: unknown;

  try {
    requestBody = await request.json();
  } catch {
    return errorResponse(400);
  }

  if (
    isRecord(requestBody) &&
    typeof requestBody.website === "string" &&
    requestBody.website.trim()
  ) {
    return Response.json({ ok: true });
  }

  const lead = validateLead(requestBody);

  if (!lead) {
    return errorResponse(400);
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!botToken || !chatId) {
    return errorResponse(500);
  }

  const message = [
    "🔥 <b>Новая заявка с лендинга «ГРАНЬ»</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Телефон:</b> ${escapeHtml(lead.phone)}`,
    `<b>Услуга:</b> ${escapeHtml(serviceNames[lead.service])}`,
    `<b>Комментарий:</b> ${escapeHtml(lead.comment ?? "Не указан")}`,
  ].join("\n");

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    TELEGRAM_REQUEST_TIMEOUT_MS,
  );

  try {
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "HTML",
        }),
        signal: controller.signal,
      },
    );

    const telegramResult: unknown = await telegramResponse
      .json()
      .catch(() => null);

    if (
      !telegramResponse.ok ||
      !isRecord(telegramResult) ||
      telegramResult.ok !== true
    ) {
      return errorResponse(502);
    }
  } catch {
    return errorResponse(502);
  } finally {
    clearTimeout(timeoutId);
  }

  return Response.json({ ok: true });
}