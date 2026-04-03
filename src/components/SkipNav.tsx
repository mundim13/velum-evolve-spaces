export default function SkipNav() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[1000] focus:px-4 focus:py-2 focus:rounded focus:font-dm focus:text-sm"
      style={{ background: "#22D3EE", color: "#050505" }}
    >
      Pular para o conteúdo
    </a>
  );
}
