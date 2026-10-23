#!/usr/bin/env python3
"""
Gera as texturas PBR do showroom /modulos (cor, normal e rugosidade), todas repetíveis sem emenda.

São procedurais (ruído espectral e Worley periódicos), sem licença de terceiros, e foram calibradas pelas
fotos do Cazita real: porcelanato grande cinza-claro, painel de carvalho, textura acrílica off-white,
seixo verde-acinzentado no box, granito preto e brita em volta do módulo.

Uso:  python3 scripts/gerar-texturas-modulos.py
Saída: public/modulos/texturas/*.webp  (o metro coberto por cada textura está em src/components/modulos/materiais.ts)
"""
from pathlib import Path

import numpy as np
from PIL import Image

SAIDA = Path(__file__).resolve().parent.parent / "public" / "modulos" / "texturas"
SAIDA.mkdir(parents=True, exist_ok=True)


# ---------- ruído periódico ----------

def ruido(n, beta, semente, ax=1.0, ay=1.0, fmin=0.0):
    """Ruído espectral 1/f^beta, periódico (sem emenda). ax/ay esticam o ruído em um eixo."""
    rng = np.random.default_rng(semente)
    branco = rng.standard_normal((n, n))
    fy = np.fft.fftfreq(n)[:, None] * n
    fx = np.fft.fftfreq(n)[None, :] * n
    f = np.sqrt((fx * ax) ** 2 + (fy * ay) ** 2)
    f[0, 0] = 1.0
    filtro = 1.0 / f**beta
    if fmin:
        filtro[f < fmin] = 0
    filtro[0, 0] = 0
    r = np.real(np.fft.ifft2(np.fft.fft2(branco) * filtro))
    return (r - r.min()) / (r.max() - r.min())


def worley(n, celulas, semente, jitter=0.85):
    """Distâncias F1 e F2 e o índice do ponto mais próximo (periódico)."""
    rng = np.random.default_rng(semente)
    pts = rng.random((celulas, celulas, 2)) * jitter + (1 - jitter) / 2
    ids = rng.random((celulas, celulas))
    tam = n / celulas
    yy, xx = np.mgrid[0:n, 0:n].astype(np.float64)
    cy = np.floor(yy / tam).astype(int)
    cx = np.floor(xx / tam).astype(int)
    f1 = np.full((n, n), np.inf)
    f2 = np.full((n, n), np.inf)
    idv = np.zeros((n, n))
    for dy in (-1, 0, 1):
        for dx in (-1, 0, 1):
            ny = cy + dy
            nx = cx + dx
            p = pts[ny % celulas, nx % celulas]
            px = (nx + p[..., 0]) * tam
            py = (ny + p[..., 1]) * tam
            d = np.hypot(xx - px, yy - py) / tam
            novo = d < f1
            f2 = np.where(novo, f1, np.minimum(f2, d))
            idv = np.where(novo, ids[ny % celulas, nx % celulas], idv)
            f1 = np.where(novo, d, f1)
    return f1, f2, idv


def normal(h, forca):
    """Normal map no padrão OpenGL (verde para cima), que é o que o three.js espera."""
    dx = (np.roll(h, -1, axis=1) - np.roll(h, 1, axis=1)) * 0.5
    dy = (np.roll(h, -1, axis=0) - np.roll(h, 1, axis=0)) * 0.5
    nx, ny, nz = -dx * forca, dy * forca, np.ones_like(h)
    comp = np.sqrt(nx**2 + ny**2 + nz**2)
    return np.stack([nx / comp, ny / comp, nz / comp], -1) * 0.5 + 0.5


def rampa(t, cores):
    """Interpola uma lista de cores hex ao longo de t (0 a 1)."""
    cs = np.array([[int(c[i : i + 2], 16) / 255 for i in (1, 3, 5)] for c in cores])
    pos = np.linspace(0, 1, len(cs))
    return np.stack([np.interp(t, pos, cs[:, k]) for k in range(3)], -1)


def salvar(arr, nome, qualidade=82):
    a = np.clip(arr, 0, 1)
    if a.ndim == 2:
        img = Image.fromarray((a * 255).astype(np.uint8), "L").convert("RGB")
    else:
        img = Image.fromarray((a * 255).astype(np.uint8), "RGB")
    caminho = SAIDA / f"{nome}.webp"
    img.save(caminho, "WEBP", quality=qualidade, method=6)
    print(f"{caminho.name:28s} {img.size[0]}px  {caminho.stat().st_size / 1024:6.1f} kB")


# ---------- materiais ----------

def reboco():
    """Textura acrílica da fachada (0,5 m). A cor é neutra: o material tinge com a cor escolhida."""
    # Gerado em 1024 e recortado em 512 (0,5 m): o grão continua com ~1 mm por pixel.
    n = 512
    grao = ruido(n, 0.35, 1)
    medio = ruido(n, 1.4, 2)
    f1, f2, _ = worley(n, 90, 3, 0.9)
    pedrinhas = np.clip(1 - f1 * 1.6, 0, 1) ** 2
    altura = 0.45 * grao + 0.35 * pedrinhas + 0.2 * medio
    cor = 0.9 + 0.07 * (medio - 0.5) + 0.06 * (altura - 0.5)
    salvar(cor[:512, :512], "reboco_cor")
    salvar(normal(altura, 5.0)[:512, :512], "reboco_normal", 72)


def porcelanato(nome, n, metros, ladrilho, base, escura, semente):
    """Porcelanato acetinado tipo cimento, com rejunte fino. ladrilho = (largura, altura) em metros."""
    px_m = n / metros
    nuvem = ruido(n, 2.2, semente)
    nuvem2 = ruido(n, 1.5, semente + 1)
    pontos = ruido(n, 0.2, semente + 2)
    yy, xx = np.mgrid[0:n, 0:n]
    lw, lh = ladrilho[0] * px_m, ladrilho[1] * px_m
    # Cada ladrilho ganha um tom levemente diferente, como nas fotos.
    idx = (np.floor(xx / lw) + 7 * np.floor(yy / lh)) % 5
    tom = (idx / 4 - 0.5) * 0.06
    t = np.clip(0.5 + 0.9 * (nuvem - 0.5) + 0.35 * (nuvem2 - 0.5) + tom, 0, 1)
    cor = rampa(t, [escura, base, "#E4E2DD"])
    cor *= (0.985 + 0.03 * pontos)[..., None]
    gx = np.minimum(xx % lw, lw - (xx % lw))
    gy = np.minimum(yy % lh, lh - (yy % lh))
    rejunte = np.clip(1.6 - np.minimum(gx, gy), 0, 1)
    cor = cor * (1 - rejunte[..., None]) + np.array([0.62, 0.6, 0.57]) * rejunte[..., None]
    altura = 0.04 * nuvem2 - rejunte * 0.6
    rug = 0.28 + 0.12 * nuvem2 + rejunte * 0.5
    salvar(cor, f"{nome}_cor")
    salvar(normal(altura, 3.0), f"{nome}_normal", 80)
    salvar(rug, f"{nome}_rug", 75)


def madeira():
    """Lâmina de carvalho do painel (1,2 m), veio vertical."""
    n = 1024
    estria = ruido(n, 1.0, 11, ax=1.0, ay=18.0)
    ondulacao = ruido(n, 2.0, 12)
    yy, xx = np.mgrid[0:n, 0:n] / n
    aneis = 0.5 + 0.5 * np.sin((xx * 38 + ondulacao * 6 + estria * 2.5) * 2 * np.pi)
    poros = ruido(n, 0.15, 13, ax=1.0, ay=10.0)
    t = np.clip(0.55 * estria + 0.3 * aneis + 0.15 * poros, 0, 1)
    cor = rampa(t, ["#8E6743", "#AD8660", "#C4A27C", "#D2B38E"])
    salvar(cor, "madeira_cor")
    salvar(normal(0.6 * aneis + 0.4 * poros, 1.2), "madeira_normal", 78)


def wpc():
    """Veio escovado do WPC (0,5 m), em tons neutros: o material tinge com o tom escolhido."""
    n = 512
    estria = ruido(n, 0.9, 21, ax=1.0, ay=22.0)
    fino = ruido(n, 0.2, 22, ax=1.0, ay=14.0)
    t = 0.78 + 0.18 * estria + 0.08 * fino
    salvar(t, "wpc_cor")
    salvar(normal(0.7 * estria + 0.3 * fino, 3.0), "wpc_normal", 78)


def grama():
    """Gramado (1,5 m): folhas finas em várias direções sobre manchas de tom."""
    n = 512
    folhas = sum(ruido(n, 0.15, 31 + k, ax=ax, ay=ay) for k, (ax, ay) in enumerate([(1, 4), (4, 1), (2, 3), (3, 2)])) / 4
    folhas = (folhas - folhas.min()) / (folhas.max() - folhas.min())
    folhas = np.clip((folhas - 0.5) * 2.2 + 0.5, 0, 1)
    manchas = ruido(n, 2.0, 36)
    t = np.clip(0.65 * folhas + 0.35 * manchas, 0, 1)
    cor = rampa(t, ["#22351A", "#3E5C27", "#5C7D33", "#7E9447", "#A3A866"])
    salvar(cor, "grama_cor", 76)
    salvar(normal(folhas, 5.0), "grama_normal", 70)


def pedras(nome, n, celulas, cores, semente, junta, cor_junta):
    """Pedras arredondadas (brita ou seixo): domo por célula de Worley, com junta entre elas."""
    f1, f2, idv = worley(n, celulas, semente, 0.95)
    # 0 na borda da célula, 1 no centro: vira um domo com a raiz quadrada.
    t = np.clip(1 - f1 / (0.5 * (f1 + f2)), 0, 1)
    pedra = np.clip((t - junta) / (1 - junta), 0, 1)
    altura = np.sqrt(pedra) * (0.7 + 0.3 * idv)
    detalhe = ruido(n, 0.5, semente + 1)
    cor = rampa(np.clip(idv + 0.12 * (detalhe - 0.5), 0, 1), cores)
    # Sombreamento do domo: borda mais escura, topo mais claro.
    cor *= (0.55 + 0.55 * np.sqrt(pedra))[..., None]
    jj = np.array([int(cor_junta[i : i + 2], 16) / 255 for i in (1, 3, 5)])
    m = (pedra <= 0)[..., None]
    cor = np.where(m, jj * (0.8 + 0.4 * detalhe[..., None]), cor)
    salvar(cor, f"{nome}_cor")
    salvar(normal(altura + 0.04 * detalhe, 9.0), f"{nome}_normal", 72)


def granito():
    """Granito preto da bancada (0,6 m)."""
    n = 512
    pontos = ruido(n, 0.05, 41)
    nuvem = ruido(n, 1.6, 42)
    cor = 0.07 + 0.04 * nuvem
    cor = np.where(pontos > 0.72, 0.32 + 0.3 * (pontos - 0.72), cor)
    cor = np.where(pontos < 0.2, 0.025, cor)
    salvar(np.stack([cor, cor, cor * 1.02], -1), "granito_cor")


def tecido():
    """Trama de tecido (0,25 m), neutra para tingir (cama, sofá, tapete)."""
    n = 512
    yy, xx = np.mgrid[0:n, 0:n] / n
    fios = 96
    trama = (np.sin(xx * fios * 2 * np.pi) * np.sin(yy * fios * 2 * np.pi)) * 0.5 + 0.5
    var = ruido(n, 1.2, 51)
    fibra = ruido(n, 0.1, 52)
    t = 0.86 + 0.08 * trama + 0.05 * (var - 0.5) + 0.04 * (fibra - 0.5)
    salvar(t, "tecido_cor")
    salvar(normal(trama * 0.7 + fibra * 0.3, 2.0), "tecido_normal", 72)


if __name__ == "__main__":
    reboco()
    porcelanato("piso", 1024, 1.8, (0.9, 0.9), "#CDCAC4", "#B9B5AE", 61)
    porcelanato("parede_banheiro", 1024, 1.2, (0.6, 1.2), "#C9C2B7", "#B3AA9D", 71)
    madeira()
    wpc()
    grama()
    pedras("brita", 512, 36, ["#5E5C58", "#7D7A74", "#9C9890", "#B3AEA5"], 81, 0.12, "#2E2C2A")
    pedras("seixo", 1024, 26, ["#6F7F6E", "#8FA08C", "#A7B3A1", "#C2C6B8"], 91, 0.16, "#B8B4AA")
    granito()
    tecido()
