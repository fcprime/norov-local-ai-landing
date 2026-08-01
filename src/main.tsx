import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
import productScreenshot from './assets/norov-local-ai-dashboard.png';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

const META_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID || '1533458127771797').trim();
const STRIPE = (import.meta.env.VITE_STRIPE_CHECKOUT_URL || '').trim();
const APP = (import.meta.env.VITE_APP_LOGIN_URL || '').trim();
const SUPPORT_EMAIL = (import.meta.env.VITE_SUPPORT_EMAIL || '').trim();
const supportLabel = SUPPORT_EMAIL || 'Email підтримки налаштовується';

const INSTAGRAM = 'https://www.instagram.com/sergej_norov/';
const TELEGRAM = 'https://t.me/s_norov';
const YOUTUBE = 'https://www.youtube.com/@sergeynorov008';
const DEMO_VIDEO = 'https://www.youtube-nocookie.com/embed/6jaRWHZ-fuo?rel=0';

const SocialIcon = ({ type }: { type: 'instagram' | 'telegram' | 'youtube' }) => {
  if (type === 'instagram')
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
        />
        <circle
          cx="12"
          cy="12"
          r="4"
        />
        <circle
          cx="17.5"
          cy="6.5"
          r="1"
        />
      </svg>
    );
  if (type === 'telegram')
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true">
        <path d="M21 3L3.8 9.6c-1.2.5-1.2 1.2-.2 1.5l4.4 1.4 1.7 5.2c.2.7.1 1 .9 1 .6 0 .9-.3 1.2-.6l2.1-2 4.4 3.2c.8.4 1.4.2 1.6-.8L22.8 5c.3-1.1-.4-1.7-1.8-1.2z" />
        <path d="M8.2 12.4l10.2-6.5c.5-.3.9-.1.5.2l-8.4 7.6-.3 3.5-2-4.8z" />
      </svg>
    );
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true">
      <path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8z" />
      <path
        className="play"
        d="M10 15.5v-7l6 3.5-6 3.5z"
      />
    </svg>
  );
};

const SocialLinks = ({ large = false }: { large?: boolean }) => (
  <div className={`socialLinks ${large ? 'large' : ''}`}>
    <a
      href={INSTAGRAM}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram">
      <SocialIcon type="instagram" />
      <span>Instagram</span>
    </a>
    <a
      href={TELEGRAM}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Telegram">
      <SocialIcon type="telegram" />
      <span>Telegram</span>
    </a>
    <a
      href={YOUTUBE}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="YouTube">
      <SocialIcon type="youtube" />
      <span>YouTube</span>
    </a>
  </div>
);

const META_CONSENT_KEY = 'norov_meta_consent';

const loadMetaPixel = () => {
  if (!META_PIXEL_ID || document.getElementById('meta-pixel-script')) return;

  const fbq = ((...args: any[]) => {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue.push(args);
  }) as ((...args: any[]) => void) & {
    callMethod?: (...args: any[]) => void;
    queue: any[];
    loaded: boolean;
    version: string;
  };
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = '2.0';
  window.fbq = fbq;
  window._fbq = fbq;

  const script = document.createElement('script');
  script.id = 'meta-pixel-script';
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);

  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
};

const track = (event: string, data: Record<string, unknown> = {}) => {
  if (typeof window.fbq === 'function') window.fbq('track', event, data);
};

const trackPurchase = () => {
  if (localStorage.getItem(META_CONSENT_KEY) !== 'accepted') return;

  loadMetaPixel();
  const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');
  const eventId = sessionId ? `stripe_${sessionId}` : `purchase_${crypto.randomUUID()}`;
  const storageKey = `norov_purchase_sent_${eventId}`;

  if (localStorage.getItem(storageKey)) return;

  window.fbq?.(
    'track',
    'Purchase',
    {
      value: 19,
      currency: 'EUR',
      content_name: 'Norov Local AI — 60 days',
    },
    { eventID: eventId },
  );
  localStorage.setItem(storageKey, new Date().toISOString());
};
const checkout = () => {
  if (!STRIPE || !/^https:\/\/(buy|checkout)\.stripe\.com\//i.test(STRIPE)) {
    window.alert('Оплата тимчасово недоступна. Будь ласка, напишіть у підтримку.');
    return;
  }
  track('InitiateCheckout', { value: 19, currency: 'EUR', content_name: 'Norov Local AI 60 days' });
  const checkoutUrl = new URL(STRIPE);
  const hasMetaConsent = localStorage.getItem(META_CONSENT_KEY) === 'accepted';
  checkoutUrl.searchParams.set('client_reference_id', hasMetaConsent ? 'meta_consent' : 'no_meta_consent');
  window.location.assign(checkoutUrl.toString());
};

const CookieConsent = () => {
  const [choice, setChoice] = useState<string | null>(() => localStorage.getItem(META_CONSENT_KEY));

  useEffect(() => {
    if (choice === 'accepted') loadMetaPixel();
  }, [choice]);

  if (choice) return null;

  const decide = (value: 'accepted' | 'rejected') => {
    localStorage.setItem(META_CONSENT_KEY, value);
    setChoice(value);
  };

  return (
    <aside className="cookieConsent" aria-label="Налаштування cookies">
      <div>
        <strong>Cookies для аналітики та реклами</strong>
        <p>
          Ми використовуємо Meta Pixel, щоб вимірювати ефективність реклами. Ви можете погодитися
          або продовжити без маркетингових cookies. <a href="/privacy">Детальніше</a>
        </p>
      </div>
      <div className="cookieActions">
        <button className="secondary" onClick={() => decide('rejected')}>Відхилити</button>
        <button onClick={() => decide('accepted')}>Прийняти</button>
      </div>
    </aside>
  );
};

const benefits = [
  [
    'Пошук компаній',
    'Задай нішу, країну, місто й радіус. Отримай список локальних бізнесів для роботи.',
  ],
  [
    'Контакти без копіювання',
    'Сайт, телефон, адреса та доступні email зберігаються в одному профілі компанії.',
  ],
  [
    'Персональні звернення',
    'Підготуй повідомлення для Email, WhatsApp та соціальних мереж під конкретний бізнес.',
  ],
  [
    'CRM для наступної дії',
    'Статуси, нотатки й історія контакту допомагають не губити потенційних клієнтів.',
  ],
];
const features = [
  '60 днів доступу',
  'До 150 пошуків',
  'До 3 000 потенційних компаній',
  'Історія пошуків і CRM-статуси',
  'Збереження нотаток',
  'Пошук у різних країнах і містах',
];
const faqs = [
  [
    'Чи гарантує сервіс продаж?',
    'Ні. Norov Local AI не гарантує угоду, але скорочує шлях від пошуку компаній до готової бази для outreach.',
  ],
  [
    'Чи потрібно щось встановлювати?',
    'Ні. Сервіс працює у браузері. Для повноцінної роботи рекомендуємо комп’ютер або ноутбук.',
  ],
  [
    'Що буде після 60 днів?',
    'Доступ зупиниться автоматично. За потреби його можна буде продовжити.',
  ],
];

const LegalFooter = () => (
  <footer className="siteFooter">
    <div className="footerBrand">
      <div className="brand">
        <span className="mark">N</span>
        <span>Norov Local AI</span>
      </div>
      <p>
        Вебсервіс для пошуку локальних B2B-компаній та керування комунікацією з потенційними
        клієнтами.
      </p>
      <SocialLinks />
    </div>
    <div className="seller">
      <strong>Norov Agency Serhii Norov</strong>
      <span>Підтримка користувачів</span>
      {SUPPORT_EMAIL ? <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> : <span>{supportLabel}</span>}
    </div>
    <nav>
      {APP && (
        <a
          href={APP}
          target="_blank"
          rel="noopener noreferrer">
          Увійти в Norov Local AI
        </a>
      )}
      <a href="/privacy">Політика конфіденційності</a>
      <a href="/terms">Умови користування</a>
      <a href="/refunds">Повернення коштів</a>
      <a href="/contacts">Контакти</a>
    </nav>
    <p className="copyright">© 2026 Norov Local AI. Усі права захищені.</p>
  </footer>
);

const LegalPage = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="page legalPage">
    <header className="topbar">
      <a
        className="brand"
        href="/">
        <span className="mark">N</span>
        <span>Norov Local AI</span>
      </a>
    </header>
    <main className="legalWrap">
      <a
        className="back"
        href="/">
        ← На головну
      </a>
      <h1>{title}</h1>
      <div className="legalContent">{children}</div>
    </main>
    <LegalFooter />
    <CookieConsent />
  </div>
);

function Privacy() {
  return (
    <LegalPage title="Політика конфіденційності">
      <h2>1. Хто обробляє дані</h2>
      <p>
        Адміністратором персональних даних є Norov Agency Serhii Norov, NIP 9121923731, REGON
        540898247, VAT UE PL9121923731.
      </p>
      <h2>2. Які дані ми можемо отримувати</h2>
      <p>
        Ми можемо обробляти ім’я, email, дані акаунта, історію використання сервісу, технічні
        журнали, а також інформацію, необхідну для обробки платежу та підтримки користувача.
      </p>
      <h2>3. Для чого використовуються дані</h2>
      <p>
        Дані використовуються для створення акаунта, надання доступу до Norov Local AI, обробки
        платежів, безпеки сервісу, підтримки користувачів і виконання юридичних обов’язків.
      </p>
      <h2>4. Постачальники послуг</h2>
      <p>
        Для роботи сервісу можуть використовуватися Stripe, Supabase, Netlify, Google та інші
        технічні постачальники. Вони отримують лише ті дані, які потрібні для виконання відповідної
        функції.
      </p>
      <h2>5. Права користувача</h2>
      <p>
        Користувач може попросити доступ до своїх даних, їх виправлення, видалення, обмеження
        обробки або подати заперечення. Для звернення напишіть на{' '}
        {SUPPORT_EMAIL ? <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> : supportLabel}
        .
      </p>
    </LegalPage>
  );
}

function Terms() {
  return (
    <LegalPage title="Умови користування">
      <h2>1. Предмет послуги</h2>
      <p>
        Norov Local AI надає тимчасовий доступ до вебсервісу для пошуку локальних B2B-компаній та
        керування комунікацією у вбудованій CRM.
      </p>
      <h2>2. Тариф</h2>
      <p>
        Стартовий пакет коштує €19 одноразово та включає 60 днів доступу, до 150 пошуків і до 3 000
        потенційних компаній.
      </p>
      <h2>3. Акаунт</h2>
      <p>
        Після успішної оплати користувач отримує на email посилання для створення пароля. Акаунт
        призначений для однієї особи та не може передаватися третім особам.
      </p>
      <h2>4. Відсутність гарантії продажів</h2>
      <p>
        Сервіс допомагає знаходити компанії та впорядковувати outreach, але не гарантує відповідей,
        угод, доходу або інших комерційних результатів.
      </p>
      <h2>5. Обмеження та доступність</h2>
      <p>
        Доступ може тимчасово перериватися через оновлення, технічні роботи або несправності
        сторонніх сервісів. Ми докладаємо розумних зусиль для стабільної роботи продукту.
      </p>
      <h2>6. Заборонене використання</h2>
      <p>
        Заборонено використовувати сервіс для спаму, шахрайства, незаконного збору даних, порушення
        прав третіх осіб або спроб обходу встановлених лімітів.
      </p>
    </LegalPage>
  );
}

function Refunds() {
  return (
    <LegalPage title="Політика повернення коштів">
      <h2>1. Запит на повернення</h2>
      <p>
        Запит можна подати на{' '}
        {SUPPORT_EMAIL ? <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> : supportLabel}
        , указавши email покупки та причину звернення.
      </p>
      <h2>2. Цифровий доступ</h2>
      <p>
        Після активації акаунта та початку надання цифрової послуги можливість повернення оцінюється
        індивідуально з урахуванням фактичного використання сервісу та застосовних прав споживача.
      </p>
      <h2>3. Технічна проблема</h2>
      <p>
        Якщо доступ не був наданий через технічну помилку і проблему неможливо усунути у розумний
        строк, користувач може отримати повне повернення коштів.
      </p>
      <h2>4. Строк обробки</h2>
      <p>
        Погоджене повернення виконується тим самим способом оплати. Строк зарахування залежить від
        Stripe, банку та платіжної системи.
      </p>
    </LegalPage>
  );
}

function Contacts() {
  return (
    <LegalPage title="Контакти">
      <div className="contactHero">
        <h2>Зв’язок і підтримка</h2>
        <p>
          Маєте питання щодо оплати, доступу або роботи Norov Local AI? Напишіть зручним для вас
          способом.
        </p>
      </div>
      <div className="contactCards">
        <a
          className="contactCard telegram"
          href={TELEGRAM}
          target="_blank"
          rel="noopener noreferrer">
          <SocialIcon type="telegram" />
          <div>
            <strong>Telegram</strong>
            <span>Найшвидший спосіб отримати відповідь</span>
          </div>
          <b>↗</b>
        </a>
        <a
          className="contactCard instagram"
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer">
          <SocialIcon type="instagram" />
          <div>
            <strong>Instagram</strong>
            <span>Профіль, кейси та новини</span>
          </div>
          <b>↗</b>
        </a>
        <a
          className="contactCard youtube"
          href={YOUTUBE}
          target="_blank"
          rel="noopener noreferrer">
          <SocialIcon type="youtube" />
          <div>
            <strong>YouTube</strong>
            <span>Навчальні відео та практичні матеріали</span>
          </div>
          <b>↗</b>
        </a>
      </div>
      <div className="emailSupport">
        <h2>Email-підтримка</h2>
        <p>
          {SUPPORT_EMAIL ? <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> : supportLabel}
        </p>
        <p>
          У зверненні щодо платежу вкажіть email, який використовувався під час оплати через Stripe.
        </p>
      </div>
    </LegalPage>
  );
}

function PaymentSuccess() {
  useEffect(() => {
    trackPurchase();
  }, []);

  return (
    <div className="page successPage">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="mark">N</span>
          <span>Norov Local AI</span>
        </a>
      </header>
      <main className="successWrap">
        <div className="successIcon" aria-hidden="true">✓</div>
        <div className="eyebrow">Оплату завершено</div>
        <h1>Дякуємо за покупку!</h1>
        <p>
          Платіж успішно прийнято. Перевірте email, указаний під час оплати: туди надійде
          інформація для створення пароля та входу в Norov Local AI.
        </p>
        {APP ? (
          <a className="successButton" href={APP} target="_blank" rel="noopener noreferrer">
            Перейти до Norov Local AI
          </a>
        ) : (
          <a className="successButton" href="/contacts">Зв’язатися з підтримкою</a>
        )}
        <small>Не бачите листа? Перевірте папку «Спам» або напишіть у підтримку.</small>
      </main>
      <LegalFooter />
      <CookieConsent />
    </div>
  );
}

function App() {
  return (
    <div className="page">
      <header className="topbar">
        <a
          className="brand"
          href="#top">
          <span className="mark">N</span>
          <span>Norov Local AI</span>
        </a>
        <nav className="headerNav">
          <a href="#demo">Демо</a>
          <a href="#features">Можливості</a>
          <a href="#pricing">Ціна</a>
          {APP && (
            <a
              href={APP}
              target="_blank"
              rel="noopener noreferrer">
              Увійти
            </a>
          )}
        </nav>
        <button
          className="headerCta"
          onClick={checkout}>
          Отримати доступ
        </button>
      </header>
      <main id="top">
        <section className="hero section">
          <div className="heroCopy">
            <div className="eyebrow">Пошук B2B-клієнтів та CRM</div>
            <h1>Знаходьте B2B-клієнтів без ручного пошуку в Google і таблиць</h1>
            <p className="lead">
              Вкажіть, кому й де продаєте. Norov Local AI знайде локальні компанії, збере доступні
              контакти та збереже потенційних клієнтів у вбудованій CRM.
            </p>
            <div className="heroActions">
              <button onClick={checkout}>Почати пошук клієнтів — €19</button>
              <a href="#demo">
                Подивитися, як працює <span>↓</span>
              </a>
            </div>
            <div className="trustLine">
              <span>60 днів доступу</span>
              <span>До 3 000 компаній</span>
              <span>Без автосписань</span>
            </div>
          </div>
          <figure className="productShot">
            <img
              src={productScreenshot}
              alt="Інтерфейс Norov Local AI з пошуком B2B-компаній"
            />
            <figcaption>Реальний інтерфейс Norov Local AI</figcaption>
          </figure>
        </section>
        <section
          className="section videoSection"
          id="demo">
          <div className="sectionIntro">
            <div className="tag">5 хвилин замість довгих пояснень</div>
            <h2>Подивись, як працює Norov Local AI</h2>
            <p>
              Від першого пошуку до збереженого ліда в CRM — показую весь процес на реальному
              прикладі.
            </p>
          </div>
          <div className="videoFrame">
            <iframe
              src={DEMO_VIDEO}
              title="Як працює Norov Local AI"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"></iframe>
          </div>
        </section>
        <section
          className="section"
          id="features">
          <div className="sectionIntro left">
            <div className="tag">Один робочий процес</div>
            <h2>Від пошуку компанії до наступного контакту</h2>
            <p>Без окремих таблиць, десятків вкладок і втрачених нотаток.</p>
          </div>
          <div className="cards">
            {benefits.map(([t, x], i) => (
              <article key={t}>
                <div className="icon">0{i + 1}</div>
                <div>
                  <h3>{t}</h3>
                  <p>{x}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="section split">
          <div>
            <div className="tag">Конкретний результат</div>
            <h2>Готова база для системного outreach</h2>
            <p>
              Сервіс не обіцяє продаж замість тебе. Він скорочує час на пошук, упорядковує контакти
              й показує, з ким потрібно продовжити розмову.
            </p>
          </div>
          <div className="stats">
            <div>
              <b>до 50</b>
              <span>компаній за один пошук</span>
            </div>
            <div>
              <b>150</b>
              <span>пошуків у стартовому пакеті</span>
            </div>
            <div>
              <b>60</b>
              <span>днів повного доступу</span>
            </div>
          </div>
        </section>
        <section className="section stepsSection">
          <div className="tag">Як почати</div>
          <h2>Перші ліди — за три кроки</h2>
          <div className="steps">
            <div>
              <b>01</b>
              <h3>Задай параметри</h3>
              <p>Обери нішу, країну, місто та радіус пошуку.</p>
            </div>
            <div>
              <b>02</b>
              <h3>Перевір компанії</h3>
              <p>Переглянь контакти й додай релевантні бізнеси до бази.</p>
            </div>
            <div>
              <b>03</b>
              <h3>Веди комунікацію</h3>
              <p>Змінюй статуси, зберігай нотатки та плануй follow-up.</p>
            </div>
          </div>
        </section>
        <section
          className="section"
          id="pricing">
          <div className="pricing">
            <div className="pricingCopy">
              <div className="eyebrow light">Ранній доступ</div>
              <h2>60 днів для перевірки сервісу в роботі</h2>
              <p>Одноразова оплата. Доступ не продовжується автоматично.</p>
              <div className="priceRow">
                <del>€39</del>
                <strong>€19</strong>
              </div>
            </div>
            <div className="pricingList">
              <ul>
                {features.map((f) => (
                  <li key={f}>
                    <span>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={checkout}>Купити доступ за €19</button>
              <small>Безпечна оплата через Stripe</small>
              <p className="consent lightConsent">
                Після оплати ви отримаєте email для створення пароля та входу в Norov Local AI.
              </p>
            </div>
          </div>
        </section>
        <section className="section faqSection">
          <div className="tag">FAQ</div>
          <h2>Коротко про головне</h2>
          <div className="faq">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="section final">
          <div className="tag">Готові шукати?</div>
          <h2>Нові клієнти не завжди приходять самі</h2>
          <p>Збери власну базу потенційних B2B-клієнтів і працюй із нею системно.</p>
          <button onClick={checkout}>Отримати доступ за €19</button>
        </section>
      </main>
      <LegalFooter />
      <CookieConsent />
      <div className="mobile">
        <div>
          <del>€39</del>
          <b>€19</b>
          <small>60 днів</small>
        </div>
        <button onClick={checkout}>Купити за €19</button>
      </div>
    </div>
  );
}

const path = window.location.pathname.replace(/\/$/, '') || '/';
const page =
  path === '/privacy' ? (
    <Privacy />
  ) : path === '/terms' ? (
    <Terms />
  ) : path === '/refunds' ? (
    <Refunds />
  ) : path === '/contacts' ? (
    <Contacts />
  ) : path === '/payment-success' ? (
    <PaymentSuccess />
  ) : (
    <App />
  );
createRoot(document.getElementById('root')!).render(page);
