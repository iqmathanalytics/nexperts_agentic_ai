import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
const DemoNav = () => (
  <nav className="demo-nav section-x">
    <Link to="/" className="inline-flex items-center transition-opacity hover:opacity-90" aria-label="Nexperts AI — home">
      <img src="/logo.png" alt="Nexperts Academy" className="h-8 w-auto object-contain" />
    </Link>
    <ul className="demo-nav__links">
      <li>
        <a href="#demos">Demos</a>
      </li>
      <li>
        <a href="#usecases">Use Cases</a>
      </li>
      <li>
        <a href="#build">Build With Us</a>
      </li>
    </ul>
    <div className="demo-nav__actions">
      <a
        href="https://www.nexpertsacademy.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="nav-academy-link hidden md:inline-flex"
      >
        <ArrowLeft className="nav-academy-link__icon h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="nav-academy-link__text">Nexperts Academy</span>
      </a>
      <a href="#demos" className="demo-nav__cta">
        Register Free →
      </a>
    </div>
  </nav>
);

export default DemoNav;
