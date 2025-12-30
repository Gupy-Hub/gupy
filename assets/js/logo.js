/**
 * assets/js/logo.js
 * OBJETIVO: Centralizar a definição da Logomarca e do Favicon.
 * Este arquivo protege a identidade visual de alterações no layout geral.
 */

// --- 1. FUNÇÃO QUE RETORNA O HTML DA LOGO ---
// O layout.js usará esta função para saber o que desenhar na barra.
function getLogoHTML() {
    return `
    <div class="brand logo-text-container" onclick="window.location.href='produtividade.html'" style="cursor: pointer;">
        <span class="logo-sub">Controle de</span>
        <span class="logo-main">Produtividade</span>
    </div>
    `;
}

// --- 2. FUNÇÃO QUE GERA E APLICA O FAVICON ---
// Cria um pequeno ícone 'P' dinamicamente usando as cores do tema.
function setFavicon() {
    // Verifica se já existe um favicon
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }

    // Cria um elemento canvas invisível para desenhar o ícone
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    // Fundo do Favicon (Cor da Navbar)
    ctx.fillStyle = '#0d1b2a'; 
    ctx.beginPath();
    // Desenha um quadrado com cantos arredondados
    ctx.roundRect(0, 0, 64, 64, 12);
    ctx.fill();

    // Texto do Favicon (Letra 'P' em branco)
    ctx.font = 'bold 42px Inter, sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('P', 32, 34);

    // Converte o desenho para uma URL e aplica ao favicon
    link.href = canvas.toDataURL("image/png");
}

// Executa a criação do favicon assim que este arquivo for carregado
setFavicon();
