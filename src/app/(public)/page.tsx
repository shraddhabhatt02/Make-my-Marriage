import Image from "next/image";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  Check,
  CircleDollarSign,
  Flower2,
  Globe2,
  Images,
  ListChecks,
  Mail,
  MapPin,
  UsersRound,
  WalletCards,
  Store,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Make My Marriage | Wedding planning, beautifully organised",
  description:
    "Bring your wedding events, guests, expenses, vendors and memories together in one thoughtful planning space.",
};

const photos = {
  couple: "/images/hero-couple.png",
  stationery: "/images/wedding-stationery.png",
  reception: "/images/wedding-reception.png",
  mehendi: "/images/mehendi.png",
  sangeet: "/images/sangeet.png",
  pheras: "/images/pheras.png",
};

const pillars = [
  {
    icon: CalendarDays,
    number: "01",
    title: "Plan events and tasks",
    description:
      "Bring every ceremony, schedule and planning task into one shared timeline.",
  },
  {
    icon: UsersRound,
    number: "02",
    title: "Manage guests and RSVPs",
    description:
      "Organise guest households and collect responses for the events they are invited to.",
  },
  {
    icon: WalletCards,
    number: "03",
    title: "Track wedding expenses",
    description:
      "Keep expenses, payments made and outstanding balances easy to understand.",
  },
  {
    icon: Store,
    number: "04",
    title: "Keep vendors organised",
    description:
      "Save vendor contacts, booking details and the notes you need to stay coordinated.",
  },
  {
    icon: Globe2,
    number: "05",
    title: "Share your wedding website",
    description:
      "Give guests one place to find the wedding information you choose to publish.",
  },
  {
    icon: Images,
    number: "06",
    title: "Collect and share memories",
    description:
      "Invite guests to submit photos, then review them before they appear in your gallery.",
  },
];

const ceremonyCards = [
  {
    day: "DAY 01 · DAYTIME",
    title: "The Mehendi & Haldi",
    subtitle: "A joyful beginning",
    image: photos.mehendi,
    alt: "Friends and family celebrating a colourful Mehendi ceremony",
  },
  {
    day: "DAY 02 · EVENING",
    title: "The Sangeet Night",
    subtitle: "Music, movement and memories",
    image: photos.sangeet,
    alt: "A warmly lit ballroom prepared for a Sangeet celebration",
  },
  {
    day: "DAY 03 · TWILIGHT",
    title: "Vedic Pheras & Reception",
    subtitle: "A moment to remember",
    image: photos.pheras,
    alt: "A lakeside wedding mandap glowing at twilight",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your wedding space",
    text: "Start with the details that matter: your celebrations, dates and plans.",
    icon: Flower2,
  },
  {
    number: "02",
    title: "Organise every detail",
    text: "Bring events, tasks, guests, expenses and vendors together as plans take shape.",
    icon: ListChecks,
  },
  {
    number: "03",
    title: "Share your celebration",
    text: "Publish guest information and gather the moments you want to remember.",
    icon: Mail,
  },
];

function Brand({ footer = false }: { footer?: boolean }) {
  return (
    <a
      aria-label="Make My Marriage home"
      className="group inline-flex items-center gap-2 sm:gap-3"
      href="#home"
    >
      <Image
        alt=""
        aria-hidden="true"
        className="h-8 w-8 shrink-0 object-contain sm:h-10 sm:w-10"
        height={120}
        src="/images/logo.svg"
        width={120}
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[0.9rem] font-semibold tracking-[-0.04em] text-[#4e051a] sm:text-[1.35rem]">
          Make My Marriage
        </span>
        {footer ? null : (
          <span className="brand-tagline mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.22em] text-[#9e7d53]">
            A more thoughtful way to plan
          </span>
        )}
      </span>
    </a>
  );
}

function PrimaryLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a className={`button-primary ${className}`} href={href}>
      {children}
    </a>
  );
}

export default function HomePage() {
  return (
    <>
      <header className="site-header">
        <div className="page-shell flex h-[4.75rem] items-center justify-between gap-2 sm:gap-4">
          <Brand />
          <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
            <a className="nav-link" href="#home">Home</a>
            <a className="nav-link" href="#features">Features</a>
            <a className="nav-link" href="#how-it-works">How it works</a>
            <a className="nav-link" href="#celebrations">Celebrations</a>
          </nav>
          <div className="header-actions">
            <span
              aria-disabled="true"
              aria-label="Sign in, coming soon"
              className="nav-link nav-sign-in"
              title="Sign-in will be available when authentication is built"
            >
              Sign in
              <span className="sign-in-status">Soon</span>
            </span>
            <PrimaryLink className="header-explore" href="#features">Explore <ArrowRight aria-hidden="true" size={16} /></PrimaryLink>
          </div>
        </div>
      </header>

      <main id="home">
        <section className="page-shell hero-section">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> A BESPOKE WEDDING PLANNING SPACE</p>
            <h1 className="display-heading">
              Your wedding.
              <br />
              <em>Every detail,</em>
              <br />
              beautifully organised.
            </h1>
            <p className="hero-description">
              From the first planning checklist to the final celebration, bring your events,
              guests, expenses, vendors and memories together in one thoughtful place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <PrimaryLink href="#features">
                Explore the features <ArrowRight aria-hidden="true" size={16} />
              </PrimaryLink>
              <a className="button-secondary" href="#how-it-works">How it works</a>
            </div>
            <p className="hero-note">
              <span aria-hidden="true" /> Designed for intimate gatherings and grand multi-day celebrations.
            </p>
          </div>

          <div className="hero-visual">
            <div className="hero-photo-frame">
              <Image
                alt="A couple sharing a quiet moment in a heritage palace courtyard"
                className="object-cover object-center"
                fill
                preload
                sizes="(max-width: 767px) 100vw, (max-width: 1199px) 52vw, 620px"
                src={photos.couple}
              />
              <span className="photo-label"><span className="eyebrow-dot" /> A BESPOKE GUEST EXPERIENCE</span>
              <div className="photo-caption">
                <span className="caption-icon"><Flower2 aria-hidden="true" size={19} /></span>
                <span>
                  <span className="caption-kicker">A MULTI-DAY CELEBRATION</span>
                  <span className="caption-title">Mehendi · Sangeet · Pheras</span>
                </span>
              </div>
            </div>
            <div className="hero-photo-footnote"><span /> Thoughtfully planned, beautifully remembered</div>
          </div>
        </section>

        <section aria-labelledby="features-title" className="section-band" id="features">
          <div className="page-shell section-padding">
            <div className="section-heading">
              <p className="eyebrow">HOLISTIC ORCHESTRATION</p>
              <h2 className="section-title" id="features-title">
                Everything your wedding needs.
                <br />
                <em>All in one place.</em>
              </h2>
              <p className="section-intro">
                Wedding planning involves countless details. Make My Marriage brings them
                together so you and your family can focus on celebrating.
              </p>
            </div>

            <div className="pillar-grid">
              {pillars.map(({ icon: Icon, number, title, description }) => (
                <article className="pillar-card" key={number}>
                  <span className="pillar-icon"><Icon aria-hidden="true" size={19} strokeWidth={1.7} /></span>
                  <p className="pillar-number">PILLAR {number}</p>
                  <h3 className="font-display text-[1.3rem] leading-tight text-[#282321]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#625b57]">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="events-title" className="page-shell feature-row section-padding" id="celebrations">
          <div className="feature-copy">
            <p className="eyebrow">FEATURE 01</p>
            <h2 className="feature-title" id="events-title">Plan every celebration.</h2>
            <p className="feature-description">
              Organise wedding events, schedules and tasks in one place. Give every ceremony
              its own details, timeline and to-do list.
            </p>
            <ul className="check-list">
              <li><Check aria-hidden="true" /> Keep ceremony dates, times and venues together</li>
              <li><Check aria-hidden="true" /> Track planning tasks and who is handling them</li>
              <li><Check aria-hidden="true" /> See what is coming up at a glance</li>
            </ul>
          </div>
          <div className="timeline-card" aria-label="Illustrative wedding event schedule">
            <div className="timeline-heading"><span>YOUR CELEBRATION SCHEDULE</span><CalendarDays aria-hidden="true" size={18} /></div>
            {[
              ["DAY 01", "The Mehendi Garden Soirée", "Udaipur · 03:00 PM – 07:00 PM", "CONFIRMED"],
              ["DAY 02", "Sangeet & Musical Night", "Grand Ballroom · 07:30 PM onwards", "CONFIRMED"],
              ["DAY 03", "Vedic Pheras & Reception", "Lakeside Mandap · 04:30 PM", "IN PROGRESS"],
            ].map(([day, title, detail, status], index) => (
              <div className="timeline-item" key={title}>
                <span className={`date-tile date-tile-${index + 1}`}><small>{day}</small><strong>{14 + index}</strong></span>
                <span className="min-w-0 flex-1">
                  <span className="timeline-event-title">{title}</span>
                  <span className="timeline-detail"><MapPin aria-hidden="true" size={13} />{detail}</span>
                </span>
                <span className="status-tag">{status}</span>
              </div>
            ))}
            <p className="illustrative-note">Illustrative schedule</p>
          </div>
        </section>

        <section aria-labelledby="guests-title" className="page-shell feature-row feature-row-reverse section-padding">
          <div className="feature-copy">
            <p className="eyebrow">FEATURE 02</p>
            <h2 className="feature-title" id="guests-title">Bring your guests together.</h2>
            <p className="feature-description">
              Organise guest households, send one invitation link and collect RSVPs for each
              event they are invited to.
            </p>
            <ul className="check-list">
              <li><Check aria-hidden="true" /> Household invitations without guest accounts or OTP</li>
              <li><Check aria-hidden="true" /> Event-specific invitations and RSVP responses</li>
              <li><Check aria-hidden="true" /> Track the invited household and attendee count separately</li>
            </ul>
          </div>
          <div className="image-feature-card">
            <div className="feature-image-wrap">
              <Image alt="Wedding invitation stationery with gold foil details" className="object-cover" fill sizes="(max-width: 767px) 100vw, 50vw" src={photos.stationery} />
              <div className="image-label"><Mail aria-hidden="true" size={17} /><span><small>HOUSEHOLD INVITATIONS</small><strong>One link. Their invited celebrations.</strong></span></div>
            </div>
          </div>
        </section>

        <section aria-labelledby="expenses-title" className="section-band">
          <div className="page-shell feature-row section-padding">
            <div className="feature-copy">
              <p className="eyebrow">FEATURE 03</p>
              <h2 className="feature-title" id="expenses-title">Stay on top of expenses.</h2>
              <p className="feature-description">
                Record expenses and payments, and see what has been paid and what remains
                outstanding. Keep the financial picture clear as plans evolve.
              </p>
              <ul className="check-list">
                <li><Check aria-hidden="true" /> Track multiple payments against an expense</li>
                <li><Check aria-hidden="true" /> See paid-to-date and outstanding balances</li>
                <li><Check aria-hidden="true" /> Use whole-rupee INR amounts</li>
              </ul>
            </div>
            <div className="budget-card" aria-label="Illustrative wedding budget">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="eyebrow">FINANCIAL CLARITY</p>
                  <h3 className="font-display mt-1 text-xl text-[#282321]">Celebration budget</h3>
                </div>
                <CircleDollarSign aria-hidden="true" className="mt-1 text-[#9e7d53]" size={21} />
              </div>
              <div className="budget-total"><span>Illustrative total</span><strong>₹45,00,000</strong></div>
              <div className="budget-bar" aria-hidden="true"><span /><span /><span /><span /></div>
              <div className="budget-categories">
                {[
                  ["Venue & stay", "₹20,00,000", "#6b1d2f"],
                  ["Floral & décor", "₹9,00,000", "#9e7d53"],
                  ["Couture & jewellery", "₹10,00,000", "#725b38"],
                  ["Photography & film", "₹6,00,000", "#c5a880"],
                ].map(([name, amount, color]) => (
                  <div className="budget-category" key={name}>
                    <span className="budget-dot" style={{ backgroundColor: color }} />
                    <span>{name}</span><strong>{amount}</strong>
                  </div>
                ))}
              </div>
              <p className="illustrative-note">Illustrative figures · whole INR amounts</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="vendors-title" className="page-shell feature-row section-padding">
          <div className="vendor-preview" aria-label="Illustrative wedding vendor list">
            <div className="vendor-preview-heading"><span>YOUR WEDDING PARTNERS</span><Store aria-hidden="true" size={18} /></div>
            {[
              ["FLORAL DESIGN", "Atelier Jasmine & Marigold", "Notes and booking details"],
              ["CINEMATOGRAPHY", "Heirloom Reels Studio", "Contact and package notes"],
              ["CULINARY", "Royal Feast Caterers", "Menu and coordination notes"],
            ].map(([category, name, description]) => (
              <div className="vendor-item" key={name}>
                <span className="vendor-avatar"><Store aria-hidden="true" size={16} /></span>
                <span><small>{category}</small><strong>{name}</strong><span>{description}</span></span>
                <Check aria-label="Saved" className="vendor-check" size={16} />
              </div>
            ))}
            <p className="illustrative-note">Illustrative vendor details</p>
          </div>
          <div className="feature-copy">
            <p className="eyebrow">FEATURE 04</p>
            <h2 className="feature-title" id="vendors-title">Find and manage your vendors.</h2>
            <p className="feature-description">
              Keep vendor contacts and planning notes close to the events and tasks they support.
            </p>
            <ul className="check-list">
              <li><Check aria-hidden="true" /> Keep useful vendor details in one address book</li>
              <li><Check aria-hidden="true" /> Record booking status and coordination notes</li>
              <li><Check aria-hidden="true" /> Find vendors through the planned discovery experience</li>
            </ul>
          </div>
        </section>

        <section aria-labelledby="website-title" className="page-shell feature-row feature-row-reverse section-padding">
          <div className="feature-copy">
            <p className="eyebrow">FEATURE 05</p>
            <h2 className="feature-title" id="website-title">Share your wedding website.</h2>
            <p className="feature-description">
              Publish the wedding details you choose, from your story and schedule to venue
              information and guest guidance.
            </p>
            <ul className="check-list">
              <li><Check aria-hidden="true" /> Choose from the planned wedding website themes</li>
              <li><Check aria-hidden="true" /> Share event details and practical guest information</li>
              <li><Check aria-hidden="true" /> Keep private organiser and guest details off the public page</li>
            </ul>
          </div>
          <div className="wedding-site-preview">
            <div className="browser-bar">
              <span /><span /><span />
              <div>example.com/your-celebration <Globe2 aria-hidden="true" size={13} /></div>
              <span className="preview-badge">Illustrative preview</span>
            </div>
            <div className="site-preview-body">
              <p className="eyebrow">CELEBRATE YOUR UNION</p>
              <h3 className="font-display">Your story, beautifully shared.</h3>
              <p>Dates · Celebrations · Venue · Guest guidance</p>
              <div className="site-preview-links"><span><MapPin aria-hidden="true" size={15} /> Venue</span><span><Flower2 aria-hidden="true" size={15} /> Itinerary</span><span><Mail aria-hidden="true" size={15} /> RSVP</span></div>
            </div>
          </div>
        </section>

        <section aria-labelledby="memories-title" className="section-band">
          <div className="page-shell feature-row section-padding">
            <div className="feature-copy">
              <p className="eyebrow">FEATURE 06</p>
              <h2 className="feature-title" id="memories-title">Celebrate and share memories.</h2>
              <p className="feature-description">
                Bring published wedding photos and guest submissions together. Organisers
                review submissions before they appear in the gallery.
              </p>
              <ul className="check-list">
                <li><Check aria-hidden="true" /> A gallery link for published photos</li>
                <li><Check aria-hidden="true" /> A separate upload link for guest submissions</li>
                <li><Check aria-hidden="true" /> Organiser approval before publication</li>
              </ul>
            </div>
            <div className="memory-image-wrap">
              <Image alt="Guests celebrating together at a candlelit wedding reception" className="object-cover" fill sizes="(max-width: 767px) 100vw, 50vw" src={photos.reception} />
              <div className="memory-photo-label"><Images aria-hidden="true" size={17} /><span><small>SHARED WEDDING MEMORIES</small><strong>Reviewed before they are shared</strong></span></div>
            </div>
          </div>
        </section>

        <section aria-labelledby="celebrations-gallery-title" className="page-shell section-padding" id="celebration-inspiration">
          <div className="section-heading">
            <p className="eyebrow">MADE FOR MULTI-DAY CELEBRATIONS</p>
            <h2 className="section-title" id="celebrations-gallery-title">Every function, thoughtfully planned.</h2>
            <p className="section-intro">From intimate morning rituals to a night on the dance floor, give each celebration room to shine.</p>
          </div>
          <div className="ceremony-grid">
            {ceremonyCards.map((ceremony) => (
              <article className="ceremony-card" key={ceremony.title}>
                <Image alt={ceremony.alt} className="object-cover transition-transform duration-500 hover:scale-[1.03]" fill sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw" src={ceremony.image} />
                <div className="ceremony-scrim" />
                <div className="ceremony-content">
                  <span className="ceremony-day">{ceremony.day}</span>
                  <h3 className="font-display text-2xl leading-tight text-white">{ceremony.title}</h3>
                  <p>{ceremony.subtitle}</p>
                  <span className="ceremony-link">PLAN YOUR SCHEDULE <ArrowRight aria-hidden="true" size={15} /></span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="how-title" className="section-band" id="how-it-works">
          <div className="page-shell section-padding">
            <div className="section-heading">
              <p className="eyebrow">A MORE THOUGHTFUL JOURNEY</p>
              <h2 className="section-title" id="how-title">A simpler way to plan your wedding.</h2>
              <p className="section-intro">Bring the details together at your own pace, from the first plan to the celebration itself.</p>
            </div>
            <div className="steps-grid">
              {steps.map(({ number, title, text, icon: Icon }) => (
                <article className="step-card" key={number}>
                  <div className="step-card-top"><span>{number}</span><Icon aria-hidden="true" size={20} /></div>
                  <h3 className="font-display text-xl text-[#282321]">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#625b57]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell closing-section" id="get-started">
          <div className="closing-content">
            <p className="eyebrow">BEGIN YOUR CHAPTER</p>
            <h2 className="section-title">Make room for the moments <em>that matter.</em></h2>
            <p>Bring your wedding planning together and enjoy more of the journey to your special day.</p>
            <PrimaryLink href="#features">Explore the platform <ArrowRight aria-hidden="true" size={16} /></PrimaryLink>
            <span className="closing-note"><ArrowDown aria-hidden="true" size={14} /> Start with the details that matter to you</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-shell footer-main">
          <div className="footer-brand">
            <Brand footer />
            <p>A thoughtful space for couples and families to bring wedding plans and celebrations together.</p>
          </div>
          <nav aria-label="Footer navigation" className="footer-nav">
            <a href="#home">Home</a><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#celebrations">Celebrations</a>
          </nav>
        </div>
        <div className="page-shell footer-bottom"><span>© {new Date().getFullYear()} Make My Marriage</span><span>Made for the moments that matter.</span></div>
      </footer>
    </>
  );
}
