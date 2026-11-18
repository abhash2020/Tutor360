
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <header className="navbar">
        <Link href="/" className="logo">
          <span className="logoIcon">T</span>
          Tutor<span>360</span>
        </Link>

        <nav>
          <a href="#features">Why Tutor360?</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section className="hero">
        <div className="heroContent">
          <div className="eyebrow">
            An Initiative by Knowledge360
          </div>

          <h1>
            Find the <span>Perfect Tutor</span>
            <br />
            for Your Child
          </h1>

          <p className="tagline">
            Best Experienced Teacher within 24 Hours
            at your Door Steps
          </p>

          <p className="heroDescription">
            Quality home tuition with experienced teachers.
            Connect with a suitable tutor for personalized
            learning and academic success.
          </p>

          <div className="heroActions">
            <Link href="/register?role=parent" className="btn primary">
              Find a Tutor
            </Link>
            <Link href="/register?role=tutor" className="btn outline">
              Become a Tutor
            </Link>
          </div>

          <div className="trustLine">
            Experienced Teachers • Personalized Learning
            • Classes 1–12
          </div>
        </div>

        <div className="heroVisual">
          <div className="visualIcon">🎓</div>
          <h2>Learning Starts Here</h2>
          <p>One-to-One Home Tuition</p>
          <div className="visualStats">
            <div>📚 All Major Boards</div>
            <div>🏠 At Your Doorstep</div>
            <div>⭐ Experienced Tutors</div>
          </div>
        </div>
      </section>

      <section className="accessSection">
        <div className="sectionHeading">
          <h2>Welcome to Tutor360</h2>
          <p>Select your account type to get started.</p>
        </div>

        <div className="accessGrid">
          <div className="accessCard">
            <div className="cardIcon">👨‍🏫</div>
            <h3>Tutor Portal</h3>
            <p>
              Register as a tutor, manage your profile
              and connect with students.
            </p>
            <Link href="/login?role=tutor" className="btn primary">
              Tutor Login
            </Link>
            <Link href="/register?role=tutor" className="textLink">
              New Tutor? Register Here
            </Link>
          </div>

          <div className="accessCard">
            <div className="cardIcon">👨‍👩‍👧</div>
            <h3>Parents Portal</h3>
            <p>
              Register your child and take the first step
              towards finding a home tutor.
            </p>
            <Link href="/login?role=parent" className="btn primary">
              Parents Login
            </Link>
            <Link href="/register?role=parent" className="textLink">
              New Parent? Register Here
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="sectionHeading">
          <h2>Why Choose Tutor360?</h2>
          <p>Personalized education delivered to your home.</p>
        </div>

        <div className="featureGrid">
          <article className="featureCard">
            <div className="featureIcon">⏱️</div>
            <h3>24-Hour Tutor Assistance</h3>
            <p>
              Our goal is to help you connect with an
              experienced tutor within 24 hours.
            </p>
          </article>

          <article className="featureCard">
            <div className="featureIcon">🏠</div>
            <h3>Home Tuition</h3>
            <p>
              Convenient one-to-one learning in the
              comfort of your home.
            </p>
          </article>

          <article className="featureCard">
            <div className="featureIcon">📖</div>
            <h3>Multiple Boards</h3>
            <p>
              Academic support for CBSE, ICSE and
              UP Board students.
            </p>
          </article>
        </div>
      </section>

      <section id="contact" className="contactSection">
        <h2>Need a Home Tutor?</h2>
        <p>Contact our team for assistance.</p>
        <a className="btn light" href="tel:8004702020">
          Call 8004702020
        </a>
        <a
          className="btn whatsapp"
          href="https://wa.me/918004702020"
          target="_blank"
          rel="noopener noreferrer"
        >
          WhatsApp Us
        </a>
      </section>

      <footer className="footer">
        <strong>Tutor360</strong>
        <p>An Initiative by Knowledge360</p>
        <p>Contact: 8004702020</p>
        <small>
          © {new Date().getFullYear()} Tutor360.
          All Rights Reserved.
        </small>
      </footer>
    </main>
  );
}
