import {
  BookingCta,
  BookingFlow,
  ServiceSelectButton,
} from "./booking-flow";
import LeadForm from "./lead-form";
import ScrollReveal from "./scroll-reveal";

import { services } from "./services";

const benefits = [
  ["Ответим быстро", "Администратор свяжется с вами в течение 15 минут в рабочее время."],
  ["Мастера с опытом", "Работаем с классикой, современными формами и сложными типами волос."],
  ["Цена известна заранее", "Никаких неожиданных доплат после стрижки или оформления бороды."],
  ["Запись без звонков", "Оставьте заявку на сайте, а удобное время подтвердим сообщением."],
];

const steps = [
  ["01", "Оставляете заявку", "Имя, телефон и услуга — займёт меньше минуты."],
  ["02", "Проверяем расписание", "Администратор видит заявку и подбирает свободные окна."],
  ["03", "Подтверждаем запись", "Связываемся с вами и согласовываем точное время."],
];

const serviceFacts = [
  ["01", "Фиксированная цена", "Стоимость известна до начала работы"],
  ["02", "Запись без звонка", "Оставьте контакты в удобное время"],
  ["03", "Ответ за 15 минут", "В рабочее время барбершопа"],
];

export default function Home() {
  return (
    <BookingFlow>
      <main className="overflow-hidden">
        <section className="hero-surface relative min-h-screen border-b border-white/10">
          <header data-site-header className="animate-premium-header relative z-20 mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-4 sm:px-8 sm:py-5 lg:px-12">
            <a
              href="#top"
              className="font-display inline-flex min-h-11 items-center text-xl font-bold uppercase text-[#f1e9da] sm:text-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#b79058]"
              aria-label="Грань, на главную"
            >
              Грань<span className="text-[#b79058]">.</span>
            </a>
            <nav className="hidden items-center gap-8 text-sm text-[#d8cfc1] md:flex lg:text-[0.95rem]" aria-label="Основная навигация">
              <a className="nav-link" href="#services">Услуги</a>
              <a className="nav-link" href="#about">О нас</a>
              <a className="nav-link" href="#contacts">Контакты</a>
            </nav>
            <BookingCta className="cta-primary h-11 px-4 text-[0.7rem] sm:px-6 sm:text-xs">
              Записаться <span aria-hidden="true">→</span>
            </BookingCta>
          </header>

          <div id="top" className="relative z-10 mx-auto grid w-full max-w-[1440px] gap-6 px-4 pb-8 pt-4 sm:gap-8 sm:px-8 sm:pb-12 sm:pt-7 lg:grid-cols-[minmax(0,1.12fr)_minmax(380px,0.72fr)] lg:gap-16 lg:px-12 lg:pb-14 lg:pt-2">
            <div className="flex min-w-0 flex-col justify-between">
              <div>
                <p className="animate-premium-hero-label mb-4 flex items-center gap-3 text-[0.68rem] sm:mb-6 sm:text-xs font-bold uppercase text-[#b79058]">
                  <span className="h-px w-8 bg-[#b79058] sm:w-10" aria-hidden="true" />
                  Барбершоп в Екатеринбурге
                </p>
                <h1 className="animate-premium-hero-title font-display max-w-4xl text-[2.8rem] font-black uppercase leading-[0.92] sm:text-[clamp(3.45rem,8vw,8rem)] sm:leading-[0.84] text-[#f1e9da]">
                  Стрижка<span className="text-outline block">без лишней</span>суеты
                </h1>
                <div className="mt-5 border-l border-[#b79058]/60 pl-4 sm:mt-7 sm:pl-7">
                  <p className="animate-premium-hero-desc max-w-md text-[0.95rem] leading-6 text-[#c9c0b2] sm:text-lg sm:leading-7">
                    Оставьте заявку — администратор уточнит детали и подтвердит удобное время. Без ожидания на линии и долгих переписок.
                  </p>
                  <BookingCta className="cta-primary animate-premium-hero-cta mt-4 h-12 px-5 text-xs sm:mt-6 sm:px-6 sm:text-sm">
                    Перейти к записи <span aria-hidden="true">→</span>
                  </BookingCta>
                </div>
              </div>

            </div>
            <div className="lg:pt-1"><LeadForm /></div>
          </div>
        </section>

        <aside className="service-board-strip hidden border-b border-white/10 bg-[#151310] text-[#f1e9da] lg:block" aria-label="Преимущества записи">
          <div className="mx-auto grid max-w-[1440px] grid-cols-3 px-12">
            {serviceFacts.map(([number, title, text], index) => (
              <div
                key={number}
                className={`grid grid-cols-[auto_1fr] gap-x-4 py-5 ${
                  index > 0 ? "border-l border-white/15 pl-7" : "pr-7"
                }`}
              >
                <p className="font-display row-span-2 text-xs font-bold text-[#b79058]">{number}</p>
                <p className="font-display text-base font-bold uppercase text-[#f1e9da]">{title}</p>
                <p className="mt-1 text-xs leading-5 text-[#8f877c]">{text}</p>
              </div>
            ))}
          </div>
        </aside>

        <section id="services" className="bg-[#efe7d8] text-[#1b1916]">
          <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-16 lg:px-12">
            <ScrollReveal variant="fade-up" className="mb-6 flex flex-col justify-between gap-4 border-b border-black/20 pb-5 sm:mb-10 sm:gap-6 sm:pb-7 lg:mb-8 lg:pb-6 sm:flex-row sm:items-end">
              <div>
                <p className="section-kicker">Услуги и цены</p>
                <h2 className="font-display mt-2 text-3xl font-black uppercase leading-[1.02] sm:mt-3 sm:text-5xl sm:leading-none lg:text-6xl">Всё, что нужно.<br />Ничего лишнего.</h2>
              </div>
              <p className="max-w-sm text-sm leading-5 text-[#5f594f] sm:text-right sm:leading-6">В стоимость входит консультация мастера, мытьё головы и укладка. Цена фиксируется до начала работы.</p>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={100} className="grid border-t border-black/15 md:grid-cols-2">
              {services.map((service, index) => (
                <article key={service.id} className={`service-row border-b border-black/15 py-5 sm:py-6 md:px-6 lg:py-5 ${index % 2 === 0 ? "md:border-r" : ""}`}>
                  <div className="flex items-start justify-between gap-3 sm:gap-5">
                    <span className="font-display text-sm font-bold text-[#9a7040]">{service.number}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-[1.35rem] font-bold uppercase leading-tight sm:text-2xl lg:text-3xl">{service.title}</h3>
                      <p className="mt-2 max-w-sm text-sm leading-5 text-[#675f54] sm:mt-3 sm:leading-6">{service.description}</p>
                      <p className="mt-4 text-xs uppercase text-[#81786b] sm:mt-5">{service.time}</p>
                      <ServiceSelectButton serviceId={service.id} />
                    </div>
                    <p className="service-price shrink-0 whitespace-nowrap text-right text-base font-bold tabular-nums sm:text-lg">{service.price}</p>
                  </div>
                </article>
              ))}
            </ScrollReveal>
          </div>
        </section>

        <section id="about" className="bg-[#1a1815] text-[#f1e9da]">
          <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-16 lg:px-12">
            <div className="grid gap-6 sm:gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-14">
              <ScrollReveal variant="fade-right">
                <p className="section-kicker text-[#b79058]">Почему Грань</p>
                <h2 className="font-display mt-2 text-3xl font-black uppercase leading-[1.02] sm:mt-3 sm:text-5xl sm:leading-none lg:text-6xl">Уважаем<br />ваше время</h2>
                <p className="mt-4 max-w-sm text-sm leading-6 text-[#aaa094] sm:mt-5 sm:text-base sm:leading-7">Мы сделали запись простой, а сервис — предсказуемым. Вы знаете, к кому идёте, сколько это займёт и сколько будет стоить.</p>
              </ScrollReveal>
              <ScrollReveal variant="fade-left" delay={100} className="grid gap-px bg-white/15 sm:grid-cols-2">
                {benefits.map(([title, text], index) => (
                  <article key={title} className="benefit-card bg-[#1a1815] p-5 sm:p-6">
                    <p className="font-display text-sm font-bold text-[#b79058]">0{index + 1}</p>
                    <h3 className="font-display mt-3 text-xl font-bold uppercase leading-tight sm:mt-6 sm:text-2xl lg:mt-5">{title}</h3>
                    <p className="mt-2 text-sm leading-5 text-[#aaa094] sm:mt-3 sm:leading-6">{text}</p>
                  </article>
                ))}
              </ScrollReveal>
            </div>
          </div>
        </section>

        <section className="process-section text-[#f8ecdc]">
          <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-16 lg:px-12 lg:py-14">
            <ScrollReveal variant="fade-up" className="flex flex-col justify-between gap-3 sm:flex-row sm:gap-5 sm:items-end">
              <div>
                <p className="section-kicker text-[#d7ae77]">Как это работает</p>
                <h2 className="font-display mt-2 text-3xl font-black uppercase leading-[1.02] sm:mt-3 sm:text-4xl sm:leading-none lg:text-5xl">Три шага до записи</h2>
              </div>
              <p className="max-w-sm text-sm leading-5 text-[#cdb9b9] sm:leading-6">Без регистрации, долгих звонков и ожидания ответа на линии.</p>
            </ScrollReveal>
            <ScrollReveal variant="fade-up" delay={100} className="mt-6 grid border-t border-white/25 sm:mt-8 md:grid-cols-3">
              {steps.map(([number, title, text], index) => (
                <article key={number} className={`process-step py-5 md:px-6 md:py-7 lg:px-8 ${index < 2 ? "border-b border-white/20 md:border-b-0 md:border-r" : ""}`}>
                  <div className="flex items-center gap-4">
                    <span className="process-number font-display origin-left text-2xl font-black text-[#d7ae77] sm:text-3xl">{number}</span>
                    <span className="h-px flex-1 bg-white/20 relative overflow-hidden" aria-hidden="true">
                      <span className="process-line-accent absolute inset-0 origin-left scale-x-0 bg-[#d7ae77]/60" />
                    </span>
                  </div>
                  <h3 className="process-title font-display mt-5 text-xl font-bold uppercase leading-tight sm:mt-6 sm:text-2xl lg:mt-7">{title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-5 text-[#cdb9b9] sm:mt-3 sm:leading-6">{text}</p>
                </article>
              ))}
            </ScrollReveal>
          </div>
        </section>

        <section id="contacts" className="bg-[#efe7d8] text-[#1b1916]">
          <div className="mx-auto grid max-w-[1440px] gap-6 px-4 py-10 sm:gap-10 sm:px-8 sm:py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:pb-12 lg:pt-16">
            <div>
              <p className="section-kicker">Контакты</p>
              <h2 className="font-display mt-2 max-w-2xl text-3xl font-black uppercase leading-[1.02] sm:mt-3 sm:text-5xl sm:leading-none lg:text-[3.5rem]">Хорошая стрижка начинается с простой записи</h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-[#675f54] sm:mt-5 sm:text-base sm:leading-7">Выберите услугу на сайте или свяжитесь с нами напрямую — администратор поможет подобрать удобное время.</p>
              <BookingCta className="cta-dark mt-5 h-12 px-6 text-xs sm:mt-7 sm:h-14 sm:px-7 sm:text-sm">Записаться онлайн <span aria-hidden="true">→</span></BookingCta>
            </div>
            <address className="grid content-start gap-5 border-t border-black/20 pt-5 not-italic sm:pt-7 md:grid-cols-3 md:gap-0 lg:grid-cols-1 lg:gap-6 lg:self-start lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
              <div>
                <p className="contact-label">Адрес</p>
                <p className="mt-2 text-lg">Екатеринбург, ул. Малышева, 51</p>
                <a className="contact-action" href="https://yandex.ru/maps/?text=Екатеринбург%2C%20улица%20Малышева%2C%2051" target="_blank" rel="noreferrer">Построить маршрут <span aria-hidden="true">→</span></a>
              </div>
              <div className="md:border-l md:border-black/15 md:pl-6 lg:border-l-0 lg:pl-0">
                <p className="contact-label">Телефон</p>
                <a className="contact-phone mt-2 text-lg" href="tel:+73430000000">+7 (343) 000-00-00</a>
                <a className="contact-action" href="tel:+73430000000">Позвонить <span aria-hidden="true">→</span></a>
              </div>
              <div className="md:border-l md:border-black/15 md:pl-6 lg:border-l-0 lg:pl-0">
                <p className="contact-label">Часы работы</p>
                <p className="mt-2 text-lg">Ежедневно, 10:00–22:00</p>
                <BookingCta className="contact-action">Записаться <span aria-hidden="true">→</span></BookingCta>
              </div>
            </address>
          </div>
        </section>

        <footer className="bg-[#11100e] text-[#8f877c]">
          <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-4 py-5 text-xs sm:gap-3 sm:py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
            <p>© 2026 Грань. Барбершоп в Екатеринбурге.</p>
            <p>Демонстрационный проект для портфолио.</p>
          </div>
        </footer>
      </main>
    </BookingFlow>
  );
}
