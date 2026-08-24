type LocationMapProps = {
  address: string;
  latitude?: string | number | null;
  longitude?: string | number | null;
  heightClass?: string;
};

export function LocationMap({ address, latitude, longitude, heightClass = "h-[260px]" }: LocationMapProps) {
  const lat = latitude !== null && latitude !== undefined ? String(latitude) : "";
  const lng = longitude !== null && longitude !== undefined ? String(longitude) : "";
  const query = lat && lng ? `${lat},${lng}` : address;
  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=vi&z=16&output=embed`;
  const linkHref = `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=vi`;

  return (
    <div className={`relative overflow-hidden rounded-md border border-[#e1e4ea] ${heightClass}`}>
      <iframe
        src={embedSrc}
        title={`Bản đồ: ${address}`}
        className="h-full w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <a
        href={linkHref}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute right-3 top-3 rounded bg-white/95 px-3 py-1.5 text-[12px] font-extrabold text-[#1f2430] shadow-sm transition hover:text-brand"
      >
        Xem bản đồ lớn
      </a>
    </div>
  );
}