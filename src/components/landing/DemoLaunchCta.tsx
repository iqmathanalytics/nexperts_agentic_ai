import { type CSSProperties } from "react";
import { Link } from "react-router-dom";

type Props = {
  className?: string;
  style?: CSSProperties;
};

const scrollDemoPageToTop = () => {
  window.scrollTo(0, 0);
};

const DemoLaunchCta = ({ className = "", style }: Props) => (
  <div className={`demo-launch-cta-wrap ${className}`.trim()} style={style}>
    <Link
      to="/demo"
      onClick={scrollDemoPageToTop}
      className="demo-launch-cta"
      aria-label="Explore free live AI demos — Agentic AI and Vibe Coding"
    >
      <span className="demo-launch-cta__shine" aria-hidden />
      <span className="demo-launch-cta__glow" aria-hidden />
      <div className="demo-launch-cta__inner">
        <div className="demo-launch-cta__badges">
          <span className="demo-launch-cta__live">
            <span className="demo-launch-cta__live-dot" aria-hidden />
            Free live demos
          </span>
          <span className="demo-launch-cta__seats">⚡ 50 seats each</span>
        </div>
        <p className="demo-launch-cta__headline">
          See AI <em className="em-agentic">think</em>, watch apps <em className="em-vibe">appear</em> — live.
        </p>
        <p className="demo-launch-cta__sub">
          Two free 2-hour Microsoft Teams sessions · Interactive · No commitment
        </p>
        <div className="demo-launch-cta__chips">
          <span className="demo-launch-cta__chip demo-launch-cta__chip--agentic">
            <span className="demo-launch-cta__chip-icon" aria-hidden>
              🤖
            </span>
            Agentic AI · 20 Jun · Sat
          </span>
          <span className="demo-launch-cta__chip demo-launch-cta__chip--vibe">
            <span className="demo-launch-cta__chip-icon" aria-hidden>
              ✨
            </span>
            Vibe Coding · 21 Jun · Sun
          </span>
        </div>
      </div>
      <span className="demo-launch-cta__action">
        Register free
        <span className="demo-launch-cta__arrow" aria-hidden>
          →
        </span>
      </span>
    </Link>
  </div>
);

export default DemoLaunchCta;
