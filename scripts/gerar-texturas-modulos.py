#!/usr/bin/env python3
"""
Gera as texturas PBR do showroom /modulos (cor, normal e rugosidade), todas repetíveis sem emenda.

São procedurais (ruído espectral e Worley periódicos), sem licença de terceiros, e foram calibradas pelas
fotos do Cazita real: porcelanato grande cinza-claro, painel de carvalho, textura acrílica off-white,
seixo verde-acinzentado no box e granito preto.

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
    """
    Textura acrílica da fachada (0,5 m): grãos de areia de 2 a 4 mm com alturas diferentes, vales mais
    escuros e pintas finas, como na foto. A cor é neutra (quase branca): o material tinge com a cor escolhida.
    """
    n = 512
    f1, f2, idv = worley(n, 140, 3, 0.95)
    grao = np.clip(1 - f1 / (0.5 * (f1 + f2)), 0, 1)
    grao = np.sqrt(grao) * (0.55 + 0.45 * idv)
    fino = ruido(n, 0.3, 1)
    medio = ruido(n, 1.5, 2)
    altura = 0.6 * grao + 0.25 * fino + 0.15 * medio
    pintas = ruido(n, 0.05, 4)
    cor = 0.95 + 0.05 * (altura - 0.5) + 0.03 * (medio - 0.5)
    cor = np.where(grao < 0.12, cor - 0.05, cor)
    cor = np.where(pintas > 0.83, cor - 0.07, cor)
    salvar(np.clip(cor, 0, 1), "reboco_cor")
    salvar(normal(altura, 6.5), "reboco_normal", 74)


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


def deck():
    """
    Tabuado do deck WPC: 4 tábuas lado a lado (u) por 1 m de comprimento (v), em tons neutros para tingir.
    As juntas ficam na textura (e não na geometria) para os mipmaps as filtrarem: na geometria, a junta
    de 8 mm fica menor que um pixel a distância e vira um pontilhado.
    """
    n = 1024
    tabuas = 4
    yy, xx = np.mgrid[0:n, 0:n] / n
    pos = (xx * tabuas) % 1.0  # posição dentro da tábua (0 a 1)
    indice = np.floor(xx * tabuas).astype(int)
    junta = 0.055  # 8 mm em 148 mm
    meia = junta / 2
    # Distância à junta mais próxima (a junta é centrada na emenda entre tábuas, em pos = 0 e 1).
    d = np.minimum(pos, 1 - pos)
    vao = d < meia
    chanfro = np.clip((d - meia) / 0.03, 0, 1)  # borda levemente arredondada
    escovado = ruido(n, 1.1, 81, ax=1.0, ay=30.0)
    ranhuras = 0.5 + 0.5 * np.sin(pos * 2 * np.pi * 9)  # frisos do WPC ao longo da tábua
    tom = np.array([0.0, 0.035, -0.025, 0.02])[indice]
    t = 0.8 + tom + 0.1 * (escovado - 0.5) + 0.025 * ranhuras
    t = t * (0.82 + 0.18 * chanfro)
    t = np.where(vao, 0.16, t)
    salvar(t, "deck_cor", 88)
    altura = np.where(vao, 0.0, 0.25 + 0.75 * np.sqrt(chanfro)) + 0.04 * ranhuras + 0.03 * escovado
    salvar(normal(altura, 6.0), "deck_normal", 85)


def pedras(nome, n, celulas, cores, semente, junta, cor_junta):
    """Pedras arredondadas (seixo do box): domo por célula de Worley, com junta entre elas."""
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
    deck()
    pedras("seixo", 1024, 26, ["#6F7F6E", "#8FA08C", "#A7B3A1", "#C2C6B8"], 91, 0.16, "#B8B4AA")
    granito()
    tecido()
