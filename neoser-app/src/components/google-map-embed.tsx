"use client";

import { MapPin, ExternalLink, Navigation } from "lucide-react";

type GoogleMapEmbedProps = {
  className?: string;
  query: string;
  addressLine1?: string;
  addressLine2?: string;
  mapsUrl?: string;
};

export function GoogleMapEmbed({
  className,
  query,
  addressLine1,
  addressLine2,
  mapsUrl,
}: GoogleMapEmbedProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const fallbackUrl =
    mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  const iframeSrc = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(query)}`
    : `https://www.google.com/maps?q=${encodeURIComponent(query)}&hl=es&z=18&output=embed`;

  return (
    <div className={className}>
      <div className="map-container">
        <a
          className="map-fallback"
          href={fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <MapPin className="mb-3 h-12 w-12 text-pink" />
          {addressLine1 && (
            <p className="font-semibold text-navy">{addressLine1}</p>
          )}
          {addressLine2 && (
            <p className="text-sm text-gray-500">{addressLine2}</p>
          )}
          <span className="btn-pink-outline mt-4 text-xs">
            <ExternalLink className="h-4 w-4" /> Abrir en Google Maps
          </span>
        </a>
        <iframe
          title="Ubicación NeoSer en Google Maps"
          src={iframeSrc}
          className="map-iframe relative z-10"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <a
        href={fallbackUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-pink hover:text-pink-dark"
      >
        <Navigation className="h-4 w-4" /> Cómo llegar
      </a>
    </div>
  );
}
