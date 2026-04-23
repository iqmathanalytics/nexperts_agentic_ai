import { MessageCircle } from "lucide-react";

const Nav = () => (
  <nav className="fixed inset-x-0 top-0 z-50 h-14 flex items-center px-[5vw] bg-obsidian/90 backdrop-blur-xl border-b border-white/[0.06]">
    <a
      href="#top"
      className="font-mono text-xs font-semibold tracking-wider text-white/70 hover:text-white transition-colors"
    >
      Nexperts<span className="text-primary-glow">Academy</span>
    </a>
    <div className="ml-auto flex items-center gap-5">
      <a href="#who" className="hidden md:inline text-[0.7rem] tracking-wider text-white/40 hover:text-white/80 transition-colors">
        Who
      </a>
      <a href="#curriculum" className="hidden md:inline text-[0.7rem] tracking-wider text-white/40 hover:text-white/80 transition-colors">
        Curriculum
      </a>
      <a href="#instructor" className="hidden md:inline text-[0.7rem] tracking-wider text-white/40 hover:text-white/80 transition-colors">
        Instructor
      </a>
      <a href="#faq" className="hidden md:inline text-[0.7rem] tracking-wider text-white/40 hover:text-white/80 transition-colors">
        FAQ
      </a>
      <a
        href="https://wa.me/601133375331"
        target="_blank"
        rel="noopener"
        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm bg-whatsapp text-white text-[0.7rem] font-semibold tracking-wider uppercase hover:scale-[1.03] transition-transform"
      >
        <MessageCircle className="w-3 h-3" /> WhatsApp
      </a>
    </div>
  </nav>
);

export default Nav;
