import Image from "next/image";

export default function TuMaiaWatermark() {
  return (
    <a
      href="https://tumaia.ai"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20 opacity-60 hover:opacity-100 hover:bg-black/50 transition-all duration-300"
      title="Built by Tu Maia AI"
    >
      <Image
        src="/images/TuMaiaPrimaryLogo1.jpeg"
        alt="Tu Maia AI"
        width={26}
        height={26}
        className="rounded-full"
      />
      <span className="text-white/80 text-[10px] tracking-wider font-medium">
        TU MAIA AI
      </span>
      <span className="text-white/50 text-[8px] tracking-wide absolute -bottom-3 left-1/2 -translate-x-1/2">
        tumaia.ai
      </span>
    </a>
  );
}
