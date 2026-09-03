import { useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Heart,
  Camera,
  Menu,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

type Service = {
  name: string;
  detail: string;
  price: number;
  category: "Hands" | "Toes" | "Removal";
};

const services: Service[] = [
  { name: "Gel Hands Only", detail: "Shape, prep & gel colour", price: 180, category: "Hands" },
  { name: "Full Manicure + Gel", detail: "Complete cuticle care & gel", price: 250, category: "Hands" },
  { name: "Rubber Base + Gel Colour", detail: "Added strength for natural nails", price: 280, category: "Hands" },
  { name: "Full Manicure + Rubber Base + Gel", detail: "Our complete healthy nail ritual", price: 320, category: "Hands" },
  { name: "Gel Toes Only", detail: "Prep, shape & gel colour", price: 180, category: "Toes" },
  { name: "Full Pedicure + Gel Toes", detail: "Smooth, restore & finish with gel", price: 300, category: "Toes" },
  { name: "Rubber Base + Gel Toes", detail: "Long-lasting reinforced finish", price: 250, category: "Toes" },
  { name: "Full Pedicure + Rubber Base + Gel Toes", detail: "The full foot care ritual", price: 350, category: "Toes" },
  { name: "Soak Off", detail: "Safe, careful product removal", price: 80, category: "Removal" },
];

const categoryCopy = {
  Hands: "Natural nail care, thoughtfully finished.",
  Toes: "Fresh, polished and beautifully cared for.",
  Removal: "Gentle removal that puts nail health first.",
};

function App() {
  const [activeCategory, setActiveCategory] = useState<"All" | Service["category"]>("All");
  const [selectedService, setSelectedService] = useState("Hand & Toe Combo");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const visibleServices = useMemo(
    () => (activeCategory === "All" ? services : services.filter((service) => service.category === activeCategory)),
    [activeCategory],
  );

  const startBooking = (service: string) => {
    setSelectedService(service);
    setSubmitted(false);
    setBookingOpen(true);
  };

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Bare and Gloss home">
          <span className="monogram">BG</span>
          <span><strong>Bare & Gloss</strong><small>Beauty Studio</small></span>
        </a>
        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          <a href="#services" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>Our approach</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
          <button type="button" className="nav-book" onClick={() => startBooking("Hand & Toe Combo")}>Book a visit</button>
        </nav>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      <section className="hero" id="home">
        <div className="hero-orbit orbit-one" />
        <div className="hero-orbit orbit-two" />
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={15} /> Mobile nail care, brought to you</p>
          <h1>Beautiful nails.<br /><em>Right at home.</em></h1>
          <p className="hero-intro">A calm, private salon experience in the comfort of your own space—specialising in natural nail care, rubber base, manicures and pedicures.</p>
          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={() => startBooking("Hand & Toe Combo")}>
              Book your appointment <ArrowRight size={17} />
            </button>
            <a className="text-link" href="#services">Explore services</a>
          </div>
          <div className="mini-proof">
            <span><ShieldCheck size={18} /> Sanitised tools</span>
            <span><Heart size={18} /> Nail health first</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-wrap">
            <img src="https://www.countryandtownhouse.com/wp-content/uploads/2024/09/Anna-Kumpan-Unsplash-768x1152.jpg" alt="Elegant natural manicure" />
          </div>
          <div className="mobile-badge"><span>100%</span> mobile</div>
          <div className="availability-card"><span className="status-dot" /><div><small>Now taking bookings</small><strong>We come to you</strong></div></div>
        </div>
      </section>

      <section className="promise-strip" aria-label="Our promise">
        <span>Natural nails</span><i />
        <span>Quality products</span><i />
        <span>Comfort at home</span><i />
        <span>Care in every detail</span>
      </section>

      <section className="services-section" id="services">
        <div className="section-heading">
          <div><p className="eyebrow">The treatment menu</p><h2>Care for hands & toes</h2></div>
          <p>Simple, considered treatments designed around healthy natural nails. Select any service to start a booking.</p>
        </div>
        <div className="category-tabs" role="tablist">
          {(["All", "Hands", "Toes", "Removal"] as const).map((category) => (
            <button type="button" key={category} className={activeCategory === category ? "active" : ""} onClick={() => setActiveCategory(category)}>
              {category}
            </button>
          ))}
        </div>
        <div className="service-layout">
          <div className="service-list">
            {visibleServices.map((service, index) => (
              <button className="service-row" type="button" key={service.name} onClick={() => startBooking(service.name)} style={{ animationDelay: `${index * 50}ms` }}>
                <span className="service-number">{String(index + 1).padStart(2, "0")}</span>
                <span className="service-info"><strong>{service.name}</strong><small>{service.detail}</small></span>
                <span className="service-price">R{service.price}</span>
                <ArrowRight className="service-arrow" size={18} />
              </button>
            ))}
          </div>
          <aside className="menu-note">
            <Sparkles size={22} />
            <h3>{activeCategory === "All" ? "Healthy nails, always" : activeCategory}</h3>
            <p>{activeCategory === "All" ? "Every treatment is performed with clean, sanitised tools and quality products." : categoryCopy[activeCategory]}</p>
            <small>Please note: travel fees may apply depending on your area.</small>
          </aside>
        </div>
      </section>

      <section className="combo-section">
        <div className="combo-image">
          <img src="/nude-pedicure.jpg" alt="Nude gel pedicure" />
        </div>
        <div className="combo-copy">
          <p className="eyebrow">Our signature pairing</p>
          <h2>The complete<br /><em>hand & toe ritual</em></h2>
          <p>Settle in and enjoy the full experience: a manicure with rubber base and gel, paired with a complete pedicure, rubber base and gel toes.</p>
          <ul>
            <li><Check size={16} /> Full manicure + rubber base & gel</li>
            <li><Check size={16} /> Full pedicure + rubber base & gel toes</li>
          </ul>
          <div className="combo-price"><span>Combo price</span><strong>R480</strong></div>
          <button type="button" className="light-button" onClick={() => startBooking("Hand & Toe Combo")}>Reserve this treatment <ArrowRight size={17} /></button>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="about-title"><p className="eyebrow">A slower kind of beauty</p><h2>Your space.<br />Your time.<br /><em>Your ritual.</em></h2></div>
        <div className="about-copy">
          <p className="dropcap">No rushing through traffic, no crowded salon. Bare & Gloss brings calm, professional nail care to the comfort of your home.</p>
          <p>Our approach is simple: clean tools, quality products and attentive care that supports your natural nails. You get to relax—we take care of the rest.</p>
          <div className="steps">
            <div><span>01</span><strong>Choose your treatment</strong><small>Find the care that suits you.</small></div>
            <div><span>02</span><strong>Pick your date</strong><small>Request a time that works.</small></div>
            <div><span>03</span><strong>We come to you</strong><small>Enjoy salon care at home.</small></div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <p className="eyebrow">Your appointment awaits</p>
        <h2>Let’s make time<br />for <em>you.</em></h2>
        <p>Ready for fresh, healthy, beautifully cared-for nails?</p>
        <button type="button" className="primary-button cream" onClick={() => startBooking("Hand & Toe Combo")}>Book an appointment <CalendarDays size={17} /></button>
        <div className="contact-links">
          <a href="tel:+27679151923"><Phone size={17} /> 067 915 1923</a>
          <a href="https://wa.me/27679151923" target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp us</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer"><Camera size={17} /> Instagram</a>
        </div>
      </section>

      <footer>
        <div className="footer-brand"><span className="monogram">BG</span><p><strong>Bare & Gloss</strong><small>Mobile Beauty Studio</small></p></div>
        <p>Natural nails. Healthy nails. Beautiful you.</p>
        <small>© 2026 Bare & Gloss Beauty Studio</small>
      </footer>

      <div className="mobile-book-bar">
        <div><small>Appointments</small><strong>We come to you</strong></div>
        <button type="button" onClick={() => startBooking("Hand & Toe Combo")}>Book now <ArrowRight size={16} /></button>
      </div>

      {bookingOpen && (
        <div
          className="modal-backdrop"
          role="presentation"
          onMouseDown={() => setBookingOpen(false)}
        >
          <section
            className="booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setBookingOpen(false)}
              aria-label="Close booking form"
            >
              <X size={20} />
            </button>

            {!submitted ? (
              <>
                <p className="eyebrow">Request an appointment</p>

                <h2 id="booking-title">
                  A little time
                  <br />
                  <em>just for you.</em>
                </h2>

                <p className="modal-intro">
                  Share your details below and we’ll confirm your mobile
                  appointment by phone or WhatsApp.
                </p>

                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <label>
                    Your name
                    <input
                      required
                      type="text"
                      placeholder="First and last name"
                    />
                  </label>

                  <label>
                    Mobile number
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 067 915 1923"
                    />
                  </label>

                  <label>
                    Treatment
                    <select
                      value={selectedService}
                      onChange={(event) =>
                        setSelectedService(event.target.value)
                      }
                    >
                      <option>Hand & Toe Combo</option>

                      {services.map((service) => (
                        <option key={service.name}>{service.name}</option>
                      ))}
                    </select>

                    <ChevronDown size={16} />
                  </label>

                  <div className="form-split">
                    <label>
                      Preferred date
                      <input required type="date" />
                    </label>

                    <label>
                      Preferred time
                      <select required defaultValue="">
                        <option value="" disabled>
                          Select
                        </option>
                        <option>Morning</option>
                        <option>Afternoon</option>
                        <option>Evening</option>
                      </select>

                      <ChevronDown size={16} />
                    </label>
                  </div>

                  <label>
                    Your area
                    <input
                      required
                      type="text"
                      placeholder="Suburb or neighbourhood"
                    />
                  </label>

                  <button className="primary-button" type="submit">
                    Send appointment request <ArrowRight size={17} />
                  </button>
                </form>
              </>
            ) : (
              <div className="success-state">
                <span>
                  <Check size={32} />
                </span>

                <p className="eyebrow">Request received</p>

                <h2>
                  Thank you,
                  <br />
                  <em>beautiful.</em>
                </h2>

                <p>
                  We’ll be in touch shortly to confirm your appointment and
                  travel details.
                </p>

                <button
                  type="button"
                  className="primary-button"
                  onClick={() => setBookingOpen(false)}
                >
                  Back to the studio
                </button>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
