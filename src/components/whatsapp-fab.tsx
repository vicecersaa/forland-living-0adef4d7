import { useEffect, useState } from "react";

const WHATSAPP_NUMBER = "6281234567890"; // ganti dengan nomor asli Forland
const MESSAGE = "Halo Forland Living, saya ingin bertanya tentang koleksi kasur & bed.";

export function WhatsAppFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const on = () => setVisible(window.scrollY > 240);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(MESSAGE)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className={
        "fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] ring-1 ring-black/5 transition-all duration-500 sm:bottom-8 sm:right-8 " +
        (visible ? "opacity-100 translate-y-0" : "pointer-events-none translate-y-3 opacity-0")
      }
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current" aria-hidden>
        <path d="M19.11 17.36c-.27-.14-1.62-.8-1.87-.89-.25-.09-.44-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.41.12-.55.13-.13.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.83-2.01-.22-.53-.44-.46-.61-.47l-.52-.01c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29 0 1.35.98 2.65 1.12 2.83.14.18 1.94 2.96 4.71 4.15.66.28 1.17.45 1.57.58.66.21 1.27.18 1.75.11.53-.08 1.62-.66 1.85-1.31.23-.64.23-1.19.16-1.31-.07-.12-.25-.19-.52-.32zM16 5.33C10.11 5.33 5.33 10.11 5.33 16c0 1.88.49 3.72 1.42 5.34L5.4 26.6l5.4-1.41A10.63 10.63 0 0 0 16 26.67c5.89 0 10.67-4.78 10.67-10.67S21.89 5.33 16 5.33zm0 19.55c-1.71 0-3.38-.46-4.83-1.33l-.34-.2-3.2.83.86-3.12-.22-.35a8.86 8.86 0 0 1-1.35-4.71c0-4.9 3.99-8.88 8.88-8.88S24.88 11.1 24.88 16 20.9 24.88 16 24.88z"/>
      </svg>
      <span className="hidden text-[0.78rem] font-medium tracking-wide sm:inline">WhatsApp Kami</span>
    </a>
  );
}