const allowedPhoneCharacters = /^[+\d\s()-]+$/;

export function isValidRussianPhone(value: string) {
  const phone = value.trim();
  const digits = phone.replace(/\D/g, "");

  if (!phone || phone.length > 30 || !allowedPhoneCharacters.test(phone)) {
    return false;
  }

  return (
    (digits.length === 10 && digits.startsWith("9")) ||
    (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8")))
  );
}

export function normalizeRussianPhone(value: string) {
  if (!isValidRussianPhone(value)) {
    return null;
  }

  const digits = value.replace(/\D/g, "");
  const subscriberDigits = digits.length === 11 ? digits.slice(1) : digits;

  return `+7 (${subscriberDigits.slice(0, 3)}) ${subscriberDigits.slice(
    3,
    6,
  )}-${subscriberDigits.slice(6, 8)}-${subscriberDigits.slice(8, 10)}`;
}
