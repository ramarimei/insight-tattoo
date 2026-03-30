import Image from "next/image";

export default function TuMaiaWatermark() {
  return (
    <a
      href="https://tumaia.ai"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg shadow-black/20 opacity-60 hover:opacity-100 hover:bg-black/50 transition-all duration-300"
      title="Built by Tu Maia AI"
    >
      <Image
        src="/images/TuMaiaPrimaryLogo1.jpeg"
        alt="Tu Maia AI"
        width={20}
        height={20}
        className="rounded-full"
      />
      <span className="text-white/80 text-[10px] tracking-wider font-medium">
        TU MAIA AI
      </span>
    </a>
  );
}
