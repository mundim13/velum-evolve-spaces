export const VELUM_WHATSAPP = "5562999447553";

export function getUtm() {
  if (typeof window === "undefined") return "";
  const p = new URLSearchParams(window.location.search);
  const parts: string[] = [];
  ["utm_source", "utm_medium", "utm_campaign"].forEach((k) => {
    const v = p.get(k);
    if (v) parts.push(`${k}=${v}`);
  });
  return parts.length ? ` ${parts.join(" ")}` : "";
}

export function openWhatsApp(msg: string) {
  const url = `https://wa.me/${VELUM_WHATSAPP}?text=${encodeURIComponent(
    msg + getUtm()
  )}`;
  const w = window.open(url, "_blank", "noopener,noreferrer");
  if (!w) window.location.href = url;
  (window as any).dataLayer?.push({ event: "whatsapp_cta", label: msg });
}

if (typeof window !== "undefined") {
  (window as any).openWhatsApp = openWhatsApp;
  (window as any).getUtm = getUtm;
}
