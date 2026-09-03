"use client";

// The encapsulation machine: a message descends the stack, each layer adds
// its header (real sizes from the course: TCP 20, IP 20, Ethernet 14 + FCS 4),
// and what travels on the wire is the sum. Click a layer to see its role.

import { useState } from "react";
import { useLocale } from "@/components/learn/useLocale";

type Layer = {
  key: string;
  name: Record<string, string>;
  header: number;
  trailer?: number;
  color: string;
  role: Record<string, string>;
};

const LAYERS: Layer[] = [
  {
    key: "app",
    name: { fr: "Application", en: "Application", es: "Aplicación" },
    header: 0,
    color: "var(--fg-muted)",
    role: {
      fr: "Produit le message utile (ici une requête HTTP). Pour les couches du dessous, c'est un SDU : des données à transporter telles quelles.",
      en: "Produces the useful message (an HTTP request here). For the layers below it is an SDU: data to carry as-is.",
      es: "Produce el mensaje útil (aquí una petición HTTP). Para las capas inferiores es un SDU: datos a transportar tal cual.",
    },
  },
  {
    key: "tcp",
    name: { fr: "Transport (TCP)", en: "Transport (TCP)", es: "Transporte (TCP)" },
    header: 20,
    color: "var(--success)",
    role: {
      fr: "Ajoute 20 octets : ports source/destination, numéros de séquence et d'acquittement, drapeaux, fenêtre. Le PDU s'appelle un segment.",
      en: "Adds 20 bytes: source/destination ports, sequence and acknowledgement numbers, flags, window. The PDU is called a segment.",
      es: "Añade 20 octetos: puertos origen/destino, números de secuencia y acuse, banderas, ventana. El PDU se llama segmento.",
    },
  },
  {
    key: "ip",
    name: { fr: "Réseau (IP)", en: "Network (IP)", es: "Red (IP)" },
    header: 20,
    color: "var(--accent)",
    role: {
      fr: "Ajoute 20 octets : adresses IP source et destination, TTL, protocole, checksum d'en-tête. Le PDU s'appelle un datagramme.",
      en: "Adds 20 bytes: source and destination IP addresses, TTL, protocol, header checksum. The PDU is called a datagram.",
      es: "Añade 20 octetos: direcciones IP origen y destino, TTL, protocolo, checksum de cabecera. El PDU se llama datagrama.",
    },
  },
  {
    key: "eth",
    name: { fr: "Accès réseau (Ethernet)", en: "Network access (Ethernet)", es: "Acceso a red (Ethernet)" },
    header: 14,
    trailer: 4,
    color: "var(--accent-warm)",
    role: {
      fr: "Ajoute 14 octets d'en-tête (adresses MAC, type) ET 4 octets de fin (FCS, le CRC). Le PDU s'appelle une trame — c'est elle qui part sur le câble.",
      en: "Adds a 14-byte header (MAC addresses, type) AND a 4-byte trailer (FCS, the CRC). The PDU is called a frame — it is what leaves on the wire.",
      es: "Añade 14 octetos de cabecera (direcciones MAC, tipo) Y 4 octetos finales (FCS, el CRC). El PDU se llama trama: es lo que sale por el cable.",
    },
  },
];

const L: Record<string, Record<string, string>> = {
  fr: {
    data: "données utiles",
    wire: "sur le câble",
    overhead: "en-têtes",
    efficiency: "part utile",
    hint: "Clique une couche pour voir ce que son en-tête contient. Chaque couche traite ce qu'elle reçoit d'en haut comme des données opaques (SDU) et colle son en-tête devant (PCI) : le tout devient son PDU.",
    octets: "octets",
    aria: "encapsulation réseau",
  },
  en: {
    data: "useful data",
    wire: "on the wire",
    overhead: "headers",
    efficiency: "useful share",
    hint: "Click a layer to see what its header contains. Each layer treats what it gets from above as opaque data (SDU) and sticks its header in front (PCI): the whole becomes its PDU.",
    octets: "bytes",
    aria: "network encapsulation",
  },
  es: {
    data: "datos útiles",
    wire: "en el cable",
    overhead: "cabeceras",
    efficiency: "parte útil",
    hint: "Haz clic en una capa para ver qué contiene su cabecera. Cada capa trata lo que recibe de arriba como datos opacos (SDU) y pega su cabecera delante (PCI): el conjunto es su PDU.",
    octets: "octetos",
    aria: "encapsulación de red",
  },
};

export function EncapsulationWidget() {
  const locale = useLocale();
  const t = L[locale] ?? L.fr;
  const [dataSize, setDataSize] = useState(1000);
  const [selected, setSelected] = useState<string>("eth");

  // cumulative PDU at each layer, from app down
  let size = dataSize;
  const rows = LAYERS.map((layer) => {
    size += layer.header + (layer.trailer ?? 0);
    return { layer, pduSize: size };
  });
  const wire = rows[rows.length - 1].pduSize;
  const overhead = wire - dataSize;
  const sel = LAYERS.find((l) => l.key === selected)!;

  const W = 560;
  const rowH = 46;
  const barMax = W - 180;

  return (
    <div className="widget-frame">
      <svg
        viewBox={`0 0 ${W} ${rows.length * rowH + 40}`}
        role="img"
        aria-label={t.aria}
        style={{ width: "100%", display: "block" }}
      >
        {rows.map(({ layer, pduSize }, i) => {
          const yTop = 12 + i * rowH;
          const scale = barMax / wire;
          const parts: { w: number; color: string; label?: string }[] = [];
          // headers of the layers below the current one wrap around later; at
          // THIS layer the PDU is: [its header][everything from above][its trailer]
          const innerSize = pduSize - layer.header - (layer.trailer ?? 0);
          if (layer.header > 0) parts.push({ w: layer.header, color: layer.color, label: `${layer.header}` });
          parts.push({ w: innerSize, color: "var(--bg-elevated)", label: i === 0 ? `${dataSize}` : undefined });
          if (layer.trailer) parts.push({ w: layer.trailer, color: layer.color, label: `${layer.trailer}` });
          let x = 150;
          return (
            <g key={layer.key} onClick={() => setSelected(layer.key)} style={{ cursor: "pointer" }}>
              <text
                x={142}
                y={yTop + 24}
                textAnchor="end"
                fill={selected === layer.key ? "var(--fg)" : "var(--fg-muted)"}
                fontSize={12}
              >
                {layer.name[locale] ?? layer.name.fr}
              </text>
              {parts.map((p, k) => {
                const wpx = Math.max(p.w * scale, p.w > 0 ? 6 : 0);
                const rect = (
                  <g key={k}>
                    <rect
                      x={x}
                      y={yTop + 6}
                      width={wpx}
                      height={26}
                      rx={4}
                      fill={p.color}
                      opacity={p.color === "var(--bg-elevated)" ? 1 : 0.85}
                      stroke={selected === layer.key ? "var(--fg)" : "var(--border)"}
                    />
                    {p.label && wpx > 16 && (
                      <text x={x + wpx / 2} y={yTop + 23} textAnchor="middle" fill="var(--fg)" fontSize={10} fontFamily="var(--font-mono, monospace)">
                        {p.label}
                      </text>
                    )}
                  </g>
                );
                x += wpx;
                return rect;
              })}
              <text x={x + 8} y={yTop + 24} fill="var(--fg-dim)" fontSize={11} fontFamily="var(--font-mono, monospace)">
                {pduSize} o
              </text>
            </g>
          );
        })}
        <text x={150} y={rows.length * rowH + 30} fill="var(--fg-muted)" fontSize={12}>
          {t.wire} : {wire} {t.octets} · {t.overhead} : {overhead} · {t.efficiency} :{" "}
          {((dataSize / wire) * 100).toFixed(1)} %
        </text>
      </svg>
      <div className="widget-controls">
        <label>
          {t.data}
          <input
            type="range"
            min={20}
            max={1460}
            step={20}
            value={dataSize}
            onChange={(e) => setDataSize(Number(e.target.value))}
          />
          <span className="widget-readout">{dataSize} o</span>
        </label>
      </div>
      <div className="widget-hint">
        <strong>{sel.name[locale] ?? sel.name.fr}.</strong> {sel.role[locale] ?? sel.role.fr}
        <br />
        {t.hint}
      </div>
    </div>
  );
}
