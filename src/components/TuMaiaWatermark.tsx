import Image from "next/image";

export default function TuMaiaWatermark() {
  return (
    <a
      href="https://tumaia.ai"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-50 opacity-60 hover:opacity-100 transition-opacity duration-300"
      title="Built by Tu Maia AI"
    >
      <Image
        src="/images/tu-maia-watermark.png"
        alt="Built by Tu Maia AI"
        width={120}
        height={40}
        className="drop-shadow-sm"
      />
    </a>
  );
}
