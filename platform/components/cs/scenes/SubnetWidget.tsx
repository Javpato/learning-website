"use client";

// The subnetting machine: an address in binary with the network / subnet /
// host parts colored, and everything the exam asks recomputed live — subnet
// address, broadcast, host range, host count. The "partiel" preset is the
// 2021 paper's site: 132.174.0.0/17 cut into 62 subnets.

import { useMemo, useState } from "react";
import { bitsFor, classOf, formatIp, maskFromPrefix, parseIp, subnetInfo } from "@/lib/cs/ipv4";
import { useLocale } from "@/components/learn/useLocale";

const L: Record<string, Record<string, string>> = {
  fr: {
    site: "adresse du site",
    sitePrefix: "préfixe du site",
    wanted: "sous-réseaux voulus",
    subnetId: "subnet-id",
    mask: "masque de sous-réseau",
    network: "adresse du sous-réseau",
    broadcast: "adresse de diffusion",
    range: "machines de … à …",
    hosts: "machines possibles",
    bits: "bits de sous-réseau",
    badIp: "adresse invalide — écris a.b.c.d",
    class: "classe",
    legend: "réseau (site)",
    legendSub: "sous-réseau",
    legendHost: "machine",
    hint: "Tout se lit sur la ligne binaire : le masque met des 1 sur le bleu foncé + bleu, des 0 sur l'orange. Adresse du sous-réseau = machine à 0 ; diffusion = machine à 1 ; on retire ces 2 adresses du compte.",
    tooMany: "trop de bits demandés pour ce préfixe",
    number: "n°",
    aria: "adresse en binaire",
  },
  en: {
    site: "site address",
    sitePrefix: "site prefix",
    wanted: "subnets wanted",
    subnetId: "subnet id",
    mask: "subnet mask",
    network: "subnet address",
    broadcast: "broadcast address",
    range: "hosts from … to …",
    hosts: "possible hosts",
    bits: "subnet bits",
    badIp: "invalid address — write a.b.c.d",
    class: "class",
    legend: "network (site)",
    legendSub: "subnet",
    legendHost: "host",
    hint: "Everything reads off the binary line: the mask puts 1s over the dark blue + blue, 0s over the orange. Subnet address = host part all 0; broadcast = all 1; those 2 addresses leave the count.",
    tooMany: "too many bits for this prefix",
    number: "no.",
    aria: "address in binary",
  },
  es: {
    site: "dirección del sitio",
    sitePrefix: "prefijo del sitio",
    wanted: "subredes deseadas",
    subnetId: "subnet id",
    mask: "máscara de subred",
    network: "dirección de la subred",
    broadcast: "dirección de difusión",
    range: "máquinas de … a …",
    hosts: "máquinas posibles",
    bits: "bits de subred",
    badIp: "dirección inválida — escribe a.b.c.d",
    class: "clase",
    legend: "red (sitio)",
    legendSub: "subred",
    legendHost: "máquina",
    hint: "Todo se lee en la línea binaria: la máscara pone 1 sobre el azul oscuro + azul y 0 sobre el naranja. Dirección de subred = máquina a 0; difusión = máquina a 1; esas 2 direcciones salen de la cuenta.",
    tooMany: "demasiados bits para este prefijo",
    number: "n.º",
    aria: "dirección en binario",
  },
};

export function SubnetWidget({ preset = "partiel" }: { preset?: "partiel" | "libre" }) {
  const locale = useLocale();
  const t = L[locale] ?? L.fr;
  const [ipText, setIpText] = useState(preset === "partiel" ? "132.174.0.0" : "192.168.0.0");
  const [sitePrefix, setSitePrefix] = useState(preset === "partiel" ? 17 : 24);
  const [wanted, setWanted] = useState(preset === "partiel" ? 62 : 4);
  const [subnetId, setSubnetId] = useState(preset === "partiel" ? 55 : 1);

  const site = parseIp(ipText);
  const subnetBits = bitsFor(wanted);
  const prefix = Math.min(sitePrefix + subnetBits, 30);
  const overflow = sitePrefix + subnetBits > 30;

  const info = useMemo(() => {
    if (site === null) return null;
    const maxId = 2 ** subnetBits - 1;
    const id = Math.min(subnetId, maxId);
    const base = (site & maskFromPrefix(sitePrefix)) >>> 0;
    const addr = (base | (id << (32 - prefix))) >>> 0;
    return { ...subnetInfo(addr, prefix), id, addr };
  }, [site, sitePrefix, subnetBits, prefix, subnetId]);

  const binary = info ? (info.network >>> 0).toString(2).padStart(32, "0") : "";

  return (
    <div className="widget-frame">
      <div style={{ padding: "0.9rem 1rem 0.2rem" }}>
        {site !== null && info ? (
          <>
            <div
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.95rem",
                letterSpacing: "0.06em",
                wordBreak: "break-all",
                lineHeight: 1.9,
              }}
              aria-label={t.aria}
            >
              {binary.split("").map((b, i) => {
                const color =
                  i < sitePrefix ? "var(--accent)" : i < prefix ? "var(--success)" : "var(--accent-warm)";
                const boundary = i === sitePrefix || i === prefix;
                return (
                  <span key={i} style={{ color, borderLeft: boundary ? "2px solid var(--fg-muted)" : undefined, paddingLeft: boundary ? 3 : 0, marginLeft: i > 0 && i % 8 === 0 ? 8 : 0 }}>
                    {b}
                  </span>
                );
              })}
            </div>
            <div style={{ fontSize: "0.78rem", color: "var(--fg-dim)", marginBottom: "0.5rem" }}>
              <span style={{ color: "var(--accent)" }}>■ {t.legend} (/{sitePrefix})</span>{" "}
              <span style={{ color: "var(--success)" }}>■ {t.legendSub} ({subnetBits} bits)</span>{" "}
              <span style={{ color: "var(--accent-warm)" }}>■ {t.legendHost} ({info.hostBits} bits)</span>
            </div>
            <table style={{ width: "100%", fontSize: "0.85rem" }}>
              <tbody>
                <tr>
                  <td>{t.mask}</td>
                  <td className="widget-readout">
                    {formatIp(maskFromPrefix(prefix))} = /{prefix}
                  </td>
                </tr>
                <tr>
                  <td>
                    {t.network} ({t.number} {info.id})
                  </td>
                  <td className="widget-readout">{formatIp(info.network)}</td>
                </tr>
                <tr>
                  <td>{t.broadcast}</td>
                  <td className="widget-readout">{formatIp(info.broadcast)}</td>
                </tr>
                <tr>
                  <td>{t.range}</td>
                  <td className="widget-readout">
                    {formatIp(info.firstHost)} → {formatIp(info.lastHost)}
                  </td>
                </tr>
                <tr>
                  <td>{t.hosts}</td>
                  <td className="widget-readout">
                    2^{info.hostBits} − 2 = {info.hostCount}
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        ) : (
          <div style={{ color: "var(--danger)", fontSize: "0.85rem" }}>{t.badIp}</div>
        )}
      </div>
      <div className="widget-controls">
        <label>
          {t.site}
          <input
            value={ipText}
            onChange={(e) => setIpText(e.target.value)}
            size={12}
            style={{ fontFamily: "var(--font-mono, monospace)" }}
          />
        </label>
        <label>
          {t.sitePrefix}
          <input type="range" min={8} max={28} step={1} value={sitePrefix} onChange={(e) => setSitePrefix(Number(e.target.value))} />
          <span className="widget-readout">/{sitePrefix}</span>
        </label>
        <label>
          {t.wanted}
          <input
            type="number"
            min={1}
            max={4096}
            value={wanted}
            onChange={(e) => setWanted(Math.max(1, Number(e.target.value) || 1))}
            style={{ width: "4.5rem" }}
          />
          <span className="widget-readout">
            → {subnetBits} {t.bits}
          </span>
        </label>
        <label>
          {t.subnetId}
          <input
            type="number"
            min={0}
            max={2 ** subnetBits - 1}
            value={subnetId}
            onChange={(e) => setSubnetId(Math.max(0, Number(e.target.value) || 0))}
            style={{ width: "4.5rem" }}
          />
        </label>
        {site !== null && (
          <span className="widget-readout">
            {t.class} {classOf(site)}
          </span>
        )}
      </div>
      <div className="widget-hint">{overflow ? t.tooMany : t.hint}</div>
    </div>
  );
}
