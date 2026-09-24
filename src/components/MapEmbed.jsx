import { farm } from "../data";

export default function MapEmbed({ title = "농장 위치" }) {
  const lat = farm.geo.latitude;
  const lng = farm.geo.longitude;
  const delta = 0.025;
  const bbox = [lng - delta, lat - delta, lng + delta, lat + delta].join("%2C");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  return (
    <figure className="map-embed">
      <iframe
        title={title}
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <figcaption>
        {farm.address.full}
        {farm.address.note ? ` · ${farm.address.note}` : ""}
      </figcaption>
    </figure>
  );
}
