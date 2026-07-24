import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

declare global { interface Window { fbq?: (...args:any[])=>void } }

const STRIPE=import.meta.env.VITE_STRIPE_CHECKOUT_URL||'#pricing';
const APP=import.meta.env.VITE_APP_LOGIN_URL||'https://norov-local-ai.netlify.app';
const SUPPORT_EMAIL=import.meta.env.VITE_SUPPORT_EMAIL||'YOUR_SUPPORT_EMAIL';

const INSTAGRAM='https://www.instagram.com/sergej_norov/';
const TELEGRAM='https://t.me/s_norov';
const YOUTUBE='https://www.youtube.com/@sergeynorov008';

const SocialIcon=({type}:{type:'instagram'|'telegram'|'youtube'})=>{
  if(type==='instagram') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg>;
  if(type==='telegram') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 3L3.8 9.6c-1.2.5-1.2 1.2-.2 1.5l4.4 1.4 1.7 5.2c.2.7.1 1 .9 1 .6 0 .9-.3 1.2-.6l2.1-2 4.4 3.2c.8.4 1.4.2 1.6-.8L22.8 5c.3-1.1-.4-1.7-1.8-1.2z"/><path d="M8.2 12.4l10.2-6.5c.5-.3.9-.1.5.2l-8.4 7.6-.3 3.5-2-4.8z"/></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.8 4.7 12 4.7 12 4.7s-5.8 0-7.6.5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.8.5 7.6.5 7.6.5s5.8 0 7.6-.5a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8z"/><path className="play" d="M10 15.5v-7l6 3.5-6 3.5z"/></svg>;
};

const SocialLinks=({large=false}:{large?:boolean})=> <div className={`socialLinks ${large?'large':''}`}>
  <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><SocialIcon type="instagram"/><span>Instagram</span></a>
  <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" aria-label="Telegram"><SocialIcon type="telegram"/><span>Telegram</span></a>
  <a href={YOUTUBE} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><SocialIcon type="youtube"/><span>YouTube</span></a>
</div>;

const track=(event:string,data:Record<string,unknown>={})=>{ if(typeof window.fbq==='function') window.fbq('track',event,data); };
const checkout=()=>{track('InitiateCheckout',{value:19,currency:'EUR',content_name:'Norov Local AI 60 days'});location.href=STRIPE;};

const benefits=[
  ['Пошук за хвилини','Обери країну, місто, радіус і тип бізнесу — сервіс збере релевантні компанії.'],
  ['Контакти в одному місці','Сайти, телефони, адреси та доступні email без ручного копіювання.'],
  ['CRM без хаосу','Позначай, кому вже писав, додавай нотатки та не губи потенційних клієнтів.'],
  ['Менше залежності від реклами','Створюй власний канал пошуку клієнтів через B2B-outreach.']
];
const features=['60 днів доступу','До 150 пошуків','До 3 000 потенційних компаній','Історія пошуків і CRM-статуси','Збереження нотаток','Пошук у різних країнах і містах'];
const faqs=[
  ['Чи гарантує сервіс продаж?','Ні. Norov Local AI не гарантує угоду, але скорочує шлях від пошуку компаній до готової бази для outreach.'],
  ['Чи потрібно щось встановлювати?','Ні. Сервіс працює у браузері. Для повноцінної роботи рекомендуємо комп’ютер або ноутбук.'],
  ['Що буде після 60 днів?','Доступ зупиниться автоматично. За потреби його можна буде продовжити.']
];

const LegalFooter=()=> <footer className="siteFooter">
  <div className="footerBrand">
    <div className="brand"><span className="mark">N</span><span>Norov Local AI</span></div>
    <p>Вебсервіс для пошуку локальних B2B-компаній та керування комунікацією з потенційними клієнтами.</p>
    <SocialLinks/>
  </div>
  <div className="seller">
    <strong>Norov Agency Serhii Norov</strong>
    <span>Підтримка користувачів</span>
    <a href={SUPPORT_EMAIL==='YOUR_SUPPORT_EMAIL'?'#':`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
  </div>
  <nav>
    <a href="/privacy">Політика конфіденційності</a>
    <a href="/terms">Умови користування</a>
    <a href="/refunds">Повернення коштів</a>
    <a href="/contacts">Контакти</a>
  </nav>
  <p className="copyright">© 2026 Norov Local AI. Усі права захищені.</p>
</footer>;

const LegalPage=({title,children}:{title:string;children:React.ReactNode})=> <div className="page legalPage">
  <header className="topbar"><a className="brand" href="/"><span className="mark">N</span><span>Norov Local AI</span></a></header>
  <main className="legalWrap"><a className="back" href="/">← На головну</a><h1>{title}</h1><div className="legalContent">{children}</div></main>
  <LegalFooter/>
</div>;

function Privacy(){return <LegalPage title="Політика конфіденційності">
  <h2>1. Хто обробляє дані</h2><p>Адміністратором персональних даних є Norov Agency Serhii Norov, NIP 9121923731, REGON 540898247, VAT UE PL9121923731.</p>
  <h2>2. Які дані ми можемо отримувати</h2><p>Ми можемо обробляти ім’я, email, дані акаунта, історію використання сервісу, технічні журнали, а також інформацію, необхідну для обробки платежу та підтримки користувача.</p>
  <h2>3. Для чого використовуються дані</h2><p>Дані використовуються для створення акаунта, надання доступу до Norov Local AI, обробки платежів, безпеки сервісу, підтримки користувачів і виконання юридичних обов’язків.</p>
  <h2>4. Постачальники послуг</h2><p>Для роботи сервісу можуть використовуватися Stripe, Supabase, Netlify, Google та інші технічні постачальники. Вони отримують лише ті дані, які потрібні для виконання відповідної функції.</p>
  <h2>5. Права користувача</h2><p>Користувач може попросити доступ до своїх даних, їх виправлення, видалення, обмеження обробки або подати заперечення. Для звернення напишіть на <a href={SUPPORT_EMAIL==='YOUR_SUPPORT_EMAIL'?'#':`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
</LegalPage>}

function Terms(){return <LegalPage title="Умови користування">
  <h2>1. Предмет послуги</h2><p>Norov Local AI надає тимчасовий доступ до вебсервісу для пошуку локальних B2B-компаній та керування комунікацією у вбудованій CRM.</p>
  <h2>2. Тариф</h2><p>Стартовий пакет коштує €19 одноразово та включає 60 днів доступу, до 150 пошуків і до 3 000 потенційних компаній.</p>
  <h2>3. Акаунт</h2><p>Після успішної оплати користувач отримує на email посилання для створення пароля. Акаунт призначений для однієї особи та не може передаватися третім особам.</p>
  <h2>4. Відсутність гарантії продажів</h2><p>Сервіс допомагає знаходити компанії та впорядковувати outreach, але не гарантує відповідей, угод, доходу або інших комерційних результатів.</p>
  <h2>5. Обмеження та доступність</h2><p>Доступ може тимчасово перериватися через оновлення, технічні роботи або несправності сторонніх сервісів. Ми докладаємо розумних зусиль для стабільної роботи продукту.</p>
  <h2>6. Заборонене використання</h2><p>Заборонено використовувати сервіс для спаму, шахрайства, незаконного збору даних, порушення прав третіх осіб або спроб обходу встановлених лімітів.</p>
</LegalPage>}

function Refunds(){return <LegalPage title="Політика повернення коштів">
  <h2>1. Запит на повернення</h2><p>Запит можна подати на <a href={SUPPORT_EMAIL==='YOUR_SUPPORT_EMAIL'?'#':`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>, указавши email покупки та причину звернення.</p>
  <h2>2. Цифровий доступ</h2><p>Після активації акаунта та початку надання цифрової послуги можливість повернення оцінюється індивідуально з урахуванням фактичного використання сервісу та застосовних прав споживача.</p>
  <h2>3. Технічна проблема</h2><p>Якщо доступ не був наданий через технічну помилку і проблему неможливо усунути у розумний строк, користувач може отримати повне повернення коштів.</p>
  <h2>4. Строк обробки</h2><p>Погоджене повернення виконується тим самим способом оплати. Строк зарахування залежить від Stripe, банку та платіжної системи.</p>
</LegalPage>}

function Contacts(){return <LegalPage title="Контакти">
  <div className="contactHero">
    <h2>Зв’язок і підтримка</h2>
    <p>Маєте питання щодо оплати, доступу або роботи Norov Local AI? Напишіть зручним для вас способом.</p>
  </div>
  <div className="contactCards">
    <a className="contactCard telegram" href={TELEGRAM} target="_blank" rel="noopener noreferrer">
      <SocialIcon type="telegram"/>
      <div><strong>Telegram</strong><span>Найшвидший спосіб отримати відповідь</span></div>
      <b>↗</b>
    </a>
    <a className="contactCard instagram" href={INSTAGRAM} target="_blank" rel="noopener noreferrer">
      <SocialIcon type="instagram"/>
      <div><strong>Instagram</strong><span>Профіль, кейси та новини</span></div>
      <b>↗</b>
    </a>
    <a className="contactCard youtube" href={YOUTUBE} target="_blank" rel="noopener noreferrer">
      <SocialIcon type="youtube"/>
      <div><strong>YouTube</strong><span>Навчальні відео та практичні матеріали</span></div>
      <b>↗</b>
    </a>
  </div>
  <div className="emailSupport">
    <h2>Email-підтримка</h2>
    <p><a href={SUPPORT_EMAIL==='YOUR_SUPPORT_EMAIL'?'#':`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
    <p>У зверненні щодо платежу вкажіть email, який використовувався під час оплати через Stripe.</p>
  </div>
</LegalPage>}

function App(){return <div className="page"><header className="topbar"><a className="brand" href="#top"><span className="mark">N</span><span>Norov Local AI</span></a></header><main id="top"><section className="hero section"><div className="eyebrow">B2B-пошук без ручної рутини</div><h1>Знайди потенційних клієнтів <span>раніше, ніж вони знайдуть конкурента</span></h1><p className="lead">Norov Local AI знаходить локальні компанії, збирає їхні контакти та допомагає вести outreach в одній CRM.</p><div className="offer"><div className="spots">Стартова ціна для перших 10 користувачів</div><div className="priceRow"><del>€39</del><strong>€19</strong></div><div className="muted">одноразово · 60 днів доступу</div><button onClick={checkout}>Купити доступ за €19</button><small>Без автосписання · Безпечна оплата через Stripe</small><p className="consent">Натискаючи кнопку, ви погоджуєтеся з <a href="/terms">Умовами користування</a> та <a href="/privacy">Політикою конфіденційності</a>.</p></div><div className="mock"><div className="mocktop"><i></i><i></i><i></i><b>Norov Local AI</b></div><div className="mockbody"><aside></aside><div className="mockmain"><div className="search">Клінінгові компанії · Wrocław · 30 км</div>{[1,2,3].map(i=><div className="company" key={i}><span>{i}</span><div><b>Локальна компанія {i}</b><small>website.com · +48 000 000 000</small></div><em>Новий</em></div>)}</div></div></div></section><section className="section"><div className="tag">Знайомо?</div><h2>Пошук клієнтів не має виглядати як нескінченне копіювання</h2><div className="cards">{benefits.map(([t,x],i)=><article key={t}><div className="icon">{['⌛','📋','🧠','📉'][i]}</div><div><h3>{t}</h3><p>{x}</p></div></article>)}</div></section><section className="section split"><div><div className="tag">Результат</div><h2>Від «не знаю, кому написати» до готової бази компаній</h2><p>Один вдалий контракт може багаторазово окупити доступ. Сервіс не продає замість тебе — він прибирає найповільнішу частину: ручний пошук і хаос у контактах.</p></div><div className="stats"><div><b>до 50</b><span>компаній за пошук</span></div><div><b>150</b><span>пошуків у пакеті</span></div><div><b>60</b><span>днів доступу</span></div></div></section><section className="section"><div className="tag">Що входить</div><h2>Все потрібне для першого системного outreach</h2><div className="features">{features.map(f=><div key={f}>✓ {f}</div>)}</div></section><section className="section"><div className="tag">Як це працює</div><h2>Три прості кроки</h2><div className="steps"><div><b>01</b><h3>Задай параметри</h3><p>Послуга, аудиторія, країна, місто та радіус.</p></div><div><b>02</b><h3>Отримай компанії</h3><p>Сервіс збере релевантні бізнеси та доступні контакти.</p></div><div><b>03</b><h3>Починай outreach</h3><p>Зберігай статуси, нотатки та плануй повторний контакт.</p></div></div></section><section className="section" id="pricing"><div className="pricing"><div className="eyebrow light">Founder access</div><h2>Почни з перших 150 пошуків</h2><p>Спеціальна стартова ціна діє лише для перших 10 користувачів.</p><div className="priceRow"><del>€39</del><strong>€19</strong></div><ul>{features.map(f=><li key={f}>✓ {f}</li>)}</ul><button onClick={checkout}>Купити доступ за €19</button><small>Card · Apple Pay · Google Pay · Link</small><p className="consent lightConsent">Після оплати ви отримаєте email для створення пароля та входу в Norov Local AI.</p></div></section><section className="section"><div className="tag">FAQ</div><h2>Часті запитання</h2><div className="faq">{faqs.map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div></section><section className="section final"><h2>Поки конкуренти чекають заявки — ти можеш знайти клієнта сам</h2><p>Отримай доступ до Norov Local AI на 60 днів і побудуй власну базу потенційних B2B-клієнтів.</p><button onClick={checkout}>Купити доступ за €19</button></section></main><LegalFooter/><div className="mobile"><div><del>€39</del><b>€19</b><small>60 днів</small></div><button onClick={checkout}>Купити за €19</button></div></div>}

const path=window.location.pathname.replace(/\/$/,'')||'/';
const page=path==='/privacy'?<Privacy/>:path==='/terms'?<Terms/>:path==='/refunds'?<Refunds/>:path==='/contacts'?<Contacts/>:<App/>;
createRoot(document.getElementById('root')!).render(page);
