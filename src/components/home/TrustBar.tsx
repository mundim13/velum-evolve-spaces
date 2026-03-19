const items = [
  "Prazo garantido em contrato",
  "100% Light Steel Frame",
  "Gestão com IA integrada",
  "Goiânia e região",
  "Empresa registrada e normatizada",
];

export default function TrustBar() {
  return (
    <section
      style={{
        background: "#081512",
        borderTop: "1px solid rgba(0,212,180,0.13)",
        borderBottom: "1px solid rgba(0,212,180,0.13)",
      }}
    >
      <div
        className="flex items-center overflow-x-auto max-w-7xl mx-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <style>{`.trust-scroll::-webkit-scrollbar { display: none; }`}</style>
        <div className="trust-scroll flex items-center overflow-x-auto w-full"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((text, i) => (
            <div key={i} className="flex items-center shrink-0">
              <div
                className="flex items-center gap-2.5 shrink-0"
                style={{ padding: "14px 20px" }}
              >
                {/* Dot */}
                <span
                  className="shrink-0 rounded-full"
                  style={{
                    width: 5,
                    height: 5,
                    background: "#00D4B4",
                  }}
                />
                <span
                  className="font-dm whitespace-nowrap"
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "rgba(237,245,243,0.45)",
                  }}
                >
                  {text}
                </span>
              </div>
              {/* Separator (not after last) */}
              {i < items.length - 1 && (
                <div
                  className="shrink-0"
                  style={{
                    width: 1,
                    height: 16,
                    background: "rgba(0,212,180,0.13)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
