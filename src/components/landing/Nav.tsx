import { WHATSAPP_HREF } from "@/lib/whatsapp";

const Nav = () => (
  <nav className="fixed inset-x-0 top-0 z-50 flex h-14 items-center border-b border-white/[0.06] bg-obsidian/90 px-4 backdrop-blur-xl sm:px-[5vw]">
    <a
      href="#top"
      className="inline-flex items-center transition-opacity hover:opacity-90"
    >
      <img src="/logo.png" alt="Nexperts Academy" className="h-8 w-auto object-contain" />
    </a>
    <div className="ml-auto flex min-w-0 shrink items-center gap-2 sm:gap-5">
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
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-sm bg-whatsapp px-2.5 py-2 text-[0.62rem] font-semibold uppercase tracking-wider text-white transition-transform hover:scale-[1.03] sm:px-3.5 sm:text-[0.7rem]"
      >
        <svg viewBox="0 0 32 32" className="h-3 w-3 fill-current" aria-hidden>
          <path d="M16 3.2c-7 0-12.8 5.6-12.8 12.6 0 2.2.6 4.3 1.7 6.1L3 28.8l7.1-1.9c1.8 1 3.8 1.5 5.9 1.5 7 0 12.8-5.6 12.8-12.6S23 3.2 16 3.2zm0 22.9c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.2 1.1 1.1-4.1-.3-.4c-1.1-1.6-1.6-3.4-1.6-5.3 0-5.9 4.9-10.8 10.9-10.8S26.9 9.8 26.9 15.7 22 26.1 16 26.1zm5.9-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.3-.7.1c-.3-.2-1.4-.5-2.6-1.7-1-1-1.7-2.1-1.9-2.4-.2-.3 0-.5.2-.7.2-.2.3-.4.5-.6.2-.2.2-.4.3-.6.1-.2 0-.5 0-.6s-.7-1.7-1-2.3c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1-1.1 2.4s1.1 2.8 1.3 3c.2.2 2.2 3.4 5.2 4.7.7.3 1.3.5 1.8.6.8.2 1.5.2 2.1.1.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.5.2-1.6 0-.1-.2-.2-.5-.4z" />
        </svg>
        WhatsApp
      </a>
    </div>
  </nav>
);

export default Nav;
