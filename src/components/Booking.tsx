'use client';

import { useEffect, useRef, useState } from 'react';
import { brand, contact, eventTypes, halls, whatsappLink } from '@/content/site';
import { INQUIRE_EVENT } from '@/lib/events';

type Field = 'name' | 'phone' | 'event' | 'date' | 'guests' | 'hall' | 'notes';
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const UNDECIDED = 'لم أقرّر بعد';
const EMPTY: Values = { name: '', phone: '', event: '', date: '', guests: '', hall: '', notes: '' };
const ORDER: Field[] = ['name', 'phone', 'event', 'date', 'guests', 'hall', 'notes'];

/** Converts Arabic-Indic / Persian digits to ASCII so validation accepts them. */
const toAsciiDigits = (s: string) =>
  s.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)).replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0));

const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

function validate(v: Values): Errors {
  const e: Errors = {};
  if (v.name.trim().length < 2) e.name = 'يرجى كتابة الاسم (حرفان على الأقل).';
  const digits = toAsciiDigits(v.phone).replace(/[\s\-().]/g, '').replace(/^(\+|00)/, '');
  if (!v.phone.trim()) e.phone = 'يرجى كتابة رقم الهاتف للتواصل معكم.';
  else if (!/^\d{9,15}$/.test(digits) || (digits.startsWith('0') && digits.length !== 10))
    e.phone = 'يبدو أن رقم الهاتف غير صحيح. مثال: 0599 123 456';
  if (!v.event) e.event = 'يرجى اختيار نوع المناسبة.';
  if (!v.date) e.date = 'يرجى اختيار التاريخ المفضّل.';
  else if (v.date < todayISO()) e.date = 'يرجى اختيار تاريخ قادم.';
  if (v.guests) {
    const n = Number(toAsciiDigits(v.guests));
    if (!Number.isInteger(n) || n < 1 || n > 10000) e.guests = 'يرجى كتابة عدد تقريبي صحيح، أو ترك الحقل فارغًا.';
  }
  if (v.notes.length > 600) e.notes = 'الملاحظات طويلة قليلًا — يرجى اختصارها إلى ٦٠٠ حرف.';
  return e;
}

const formatDate = (iso: string) => {
  try {
    return new Intl.DateTimeFormat('ar-PS-u-nu-latn', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${iso}T12:00:00`));
  } catch {
    return iso;
  }
};

function composeMessage(v: Values) {
  const lines = [
    `مرحبًا ${brand.nameAr}،`,
    'أودّ الاستفسار عن إمكانية الحجز لمناسبة:',
    '',
    `• الاسم: ${v.name.trim()}`,
    `• رقم الهاتف: ${toAsciiDigits(v.phone.trim())}`,
    `• نوع المناسبة: ${v.event}`,
    `• التاريخ المفضّل: ${formatDate(v.date)}`,
  ];
  if (v.guests) lines.push(`• عدد الضيوف التقريبي: ${toAsciiDigits(v.guests)}`);
  if (v.hall) lines.push(`• القاعة: ${v.hall}`);
  if (v.notes.trim()) lines.push(`• ملاحظات: ${v.notes.trim()}`);
  lines.push('', 'بانتظار تواصلكم لتأكيد التوفّر والتفاصيل. شكرًا لكم.');
  return lines.join('\n');
}

export default function Booking() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);
  const [minDate, setMinDate] = useState<string>();
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMinDate(todayISO()), []);

  // "Inquire" buttons elsewhere on the page can preselect a hall.
  useEffect(() => {
    const onInquire = (e: Event) => {
      const hall = (e as CustomEvent<{ hall?: string }>).detail?.hall;
      setSent(null);
      if (hall) setValues((v) => ({ ...v, hall }));
      setTimeout(() => formRef.current?.querySelector<HTMLInputElement>('#f-name')?.focus({ preventScroll: true }), 700);
    };
    window.addEventListener(INQUIRE_EVENT, onInquire);
    return () => window.removeEventListener(INQUIRE_EVENT, onInquire);
  }, []);

  const set = (f: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [f]: value }));
    if (errors[f]) setErrors((er) => ({ ...er, [f]: validate({ ...values, [f]: value })[f] }));
  };
  const blur = (f: Field) => () => {
    if (values[f]) setErrors((er) => ({ ...er, [f]: validate(values)[f] }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = ORDER.find((f) => found[f]);
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#f-${first}`)?.focus();
      return;
    }
    const message = composeMessage(values);
    setSent(message);
    // Opens WhatsApp with an editable, pre-filled message. Nothing is sent automatically.
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer');
    setTimeout(() => statusRef.current?.focus(), 50);
  };

  const err = (f: Field) =>
    errors[f] ? (
      <p className="field__error" id={`e-${f}`}>
        {errors[f]}
      </p>
    ) : null;
  const a11y = (f: Field, hint?: boolean) => ({
    id: `f-${f}`,
    name: f,
    value: values[f],
    onChange: set(f),
    onBlur: blur(f),
    'aria-invalid': errors[f] ? true : undefined,
    'aria-describedby': [errors[f] ? `e-${f}` : '', hint ? `h-${f}` : ''].filter(Boolean).join(' ') || undefined,
  });

  const errorCount = Object.values(errors).filter(Boolean).length;
  const mailto = sent
    ? `mailto:${contact.email}?subject=${encodeURIComponent(`استفسار عن حجز — ${values.event}`)}&body=${encodeURIComponent(sent)}`
    : `mailto:${contact.email}`;

  return (
    <section id="booking" className="section section--ivory booking" aria-labelledby="booking-title">
      <div className="container booking__grid">
        <div className="booking__intro" data-reveal>
          <p className="eyebrow">تواصل معنا</p>
          <h2 id="booking-title" className="section-title display">حكايتكم القادمة قد تبدأ من هنا</h2>
          <p className="section-lead">أخبرونا عن مناسبتكم، ودعونا نساعدكم في استكشاف الخيارات المناسبة.</p>

          <ul className="contact-list">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                <span className="contact-list__k">واتساب</span>
                <span className="contact-list__v" dir="ltr">{contact.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={contact.phoneHref}>
                <span className="contact-list__k">اتصال</span>
                <span className="contact-list__v" dir="ltr">{contact.phoneDisplay}</span>
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`}>
                <span className="contact-list__k">البريد</span>
                <span className="contact-list__v" dir="ltr">{contact.email}</span>
              </a>
            </li>
            <li>
              <a href={contact.facebook} target="_blank" rel="noopener noreferrer">
                <span className="contact-list__k">فيسبوك</span>
                <span className="contact-list__v">{brand.nameAr}</span>
              </a>
            </li>
          </ul>
          <p className="booking__note">
            إرسال الاستفسار لا يعني تأكيد الحجز أو توفّر التاريخ؛ يتواصل معكم فريق {brand.nameAr} لتأكيد التفاصيل.
          </p>
        </div>

        <div className="booking__card" data-reveal>
          {sent ? (
            <div className="booking__success" ref={statusRef} tabIndex={-1} role="status">
              <svg viewBox="0 0 64 64" aria-hidden="true" className="booking__check">
                <circle cx="32" cy="32" r="30" />
                <path d="M20 33 l8 8 l16 -18" />
              </svg>
              <h3 className="display">رسالتكم جاهزة في واتساب</h3>
              <p>
                فتحنا لكم محادثة مع {brand.nameAr} برسالة تحتوي تفاصيل مناسبتكم. راجعوها وعدّلوها كما تشاؤون، ثم اضغطوا إرسال.
              </p>
              <p className="booking__small">هذا استفسار وليس تأكيدًا للحجز — سيؤكّد الفريق التوفّر والتفاصيل معكم مباشرة.</p>
              <div className="booking__success-actions">
                <a className="btn btn--gold" href={whatsappLink(sent)} target="_blank" rel="noopener noreferrer">
                  فتح واتساب مرة أخرى
                </a>
                <a className="btn btn--line" href={mailto}>
                  الإرسال عبر البريد بدلًا من ذلك
                </a>
                <button type="button" className="btn btn--text" onClick={() => setSent(null)}>
                  تعديل البيانات
                </button>
              </div>
            </div>
          ) : (
            <form ref={formRef} className="form" noValidate onSubmit={onSubmit} aria-describedby="form-hint">
              <p id="form-hint" className="form__hint">
                الحقول المميّزة بـ <span aria-hidden="true">*</span>
                <span className="sr-only">نجمة</span> مطلوبة.
              </p>
              <div className="sr-only" aria-live="polite">
                {errorCount > 0 ? `يوجد ${errorCount} من الحقول بحاجة إلى مراجعة.` : ''}
              </div>

              <div className="form__row">
                <div className="field">
                  <label htmlFor="f-name">الاسم <span aria-hidden="true">*</span></label>
                  <input type="text" autoComplete="name" required {...a11y('name')} />
                  {err('name')}
                </div>
                <div className="field">
                  <label htmlFor="f-phone">رقم الهاتف <span aria-hidden="true">*</span></label>
                  <input type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="05XX XXX XXX" required {...a11y('phone')} />
                  {err('phone')}
                </div>
              </div>

              <div className="form__row">
                <div className="field">
                  <label htmlFor="f-event">نوع المناسبة <span aria-hidden="true">*</span></label>
                  <select required {...a11y('event')}>
                    <option value="" disabled>
                      اختاروا نوع المناسبة
                    </option>
                    {eventTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                  {err('event')}
                </div>
                <div className="field">
                  <label htmlFor="f-date">التاريخ المفضّل <span aria-hidden="true">*</span></label>
                  <input type="date" min={minDate} required {...a11y('date', true)} />
                  <p className="field__hint" id="h-date">نتحقّق من التوفّر ونؤكّده معكم.</p>
                  {err('date')}
                </div>
              </div>

              <div className="form__row">
                <div className="field">
                  <label htmlFor="f-guests">عدد الضيوف التقريبي <span className="field__opt">(اختياري)</span></label>
                  <input type="text" inputMode="numeric" {...a11y('guests')} />
                  {err('guests')}
                </div>
                {halls.length > 0 && (
                  <div className="field">
                    <label htmlFor="f-hall">القاعة <span className="field__opt">(اختياري)</span></label>
                    <select {...a11y('hall')}>
                      <option value="">{UNDECIDED}</option>
                      {halls.map((h) => (
                        <option key={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="field">
                <label htmlFor="f-notes">ملاحظات إضافية <span className="field__opt">(اختياري)</span></label>
                <textarea rows={3} maxLength={700} {...a11y('notes')} />
                {err('notes')}
              </div>

              <div className="form__submit">
                <button type="submit" className="btn btn--gold btn--lg" data-magnetic>
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="btn__icon">
                    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z" />
                  </svg>
                  جهّزوا رسالتي على واتساب
                </button>
                <p className="form__fine">ستُفتح محادثة واتساب برسالة جاهزة يمكنكم تعديلها قبل الإرسال.</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
