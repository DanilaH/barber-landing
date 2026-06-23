export type ServiceId =
  | "haircut"
  | "haircut-beard"
  | "beard-care"
  | "kids";

export type Service = {
  id: ServiceId;
  number: string;
  title: string;
  description: string;
  price: string;
  time: string;
};

export const services = [
  {
    id: "haircut",
    number: "01",
    title: "Мужская стрижка",
    description:
      "Подберём форму под ваш стиль, тип волос и привычную укладку.",
    price: "1 800 ₽",
    time: "60 минут",
  },
  {
    id: "haircut-beard",
    number: "02",
    title: "Стрижка + борода",
    description:
      "Полный образ за один визит: стрижка, оформление и контуры.",
    price: "2 700 ₽",
    time: "90 минут",
  },
  {
    id: "beard-care",
    number: "03",
    title: "Уход за бородой",
    description:
      "Форма, распаривание, аккуратные контуры и уходовые средства.",
    price: "1 200 ₽",
    time: "45 минут",
  },
  {
    id: "kids",
    number: "04",
    title: "Детская стрижка",
    description: "Спокойно и без спешки для гостей от 6 до 12 лет.",
    price: "1 400 ₽",
    time: "45 минут",
  },
] as const satisfies readonly Service[];

export const serviceNames = Object.fromEntries(
  services.map((service) => [service.id, service.title]),
) as Record<ServiceId, string>;

export function isServiceId(value: unknown): value is ServiceId {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(serviceNames, value)
  );
}
