import { WHATSAPP_HREF } from "@/lib/whatsapp";

const Footer = () => (
  <footer className="bg-obsidian border-t border-white/[0.06] px-[5vw] py-10">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="Nexperts Academy" className="h-8 w-auto object-contain" />
        <span className="text-white/25 text-xs">© {new Date().getFullYear()} · Petaling Jaya, Malaysia</span>
      </div>
      <div className="flex flex-wrap items-center gap-5 text-[0.7rem] text-white/40">
        <a href="https://www.nexpertsacademy.com" target="_blank" rel="noopener" className="hover:text-white/80 transition-colors">
          nexpertsacademy.com
        </a>
        <a href={WHATSAPP_HREF} target="_blank" rel="noopener" className="hover:text-success transition-colors">
          WhatsApp
        </a>
        <a href="mailto:hello@nexpertsacademy.com" className="hover:text-white/80 transition-colors">
          hello@nexpertsacademy.com
        </a>
      </div>
    </div>
  </footer>
);

export default Footer;
