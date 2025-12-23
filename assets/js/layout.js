// assets/js/layout.js

function renderNavbar() {
    // Não renderiza navbar na tela de login
    if(window.location.pathname.includes('index.html')) return;

    const navHTML = `
    <nav class="navbar">
        <div class="nav-left">
            <div class="brand" onclick="window.location.href='produtividade.html'">
                <div class="big">PRODUTIVIDADE<span>.</span></div>
            </div>
            <div class="nav-links">
                <a href="gestao.html" class="nav-item ${isActive('gestao.html')}">Gestão</a>
                <a href="produtividade.html" class="nav-item ${isActive('produtividade.html')}">Produtividade</a>
                <a href="performance.html" class="nav-item ${isActive('performance.html')}">Performance</a>
                <a href="consolidado.html" class="nav-item ${isActive('consolidado.html')}">Consolidado</a>
                <a href="minha_area.html" class="nav-item ${isActive('minha_area.html')}">Minha Área</a>
            </div>
        </div>
        <div class="user-area">
            <span id="user-display" class="user-name">${SESSAO_ATUAL ? SESSAO_ATUAL.nome : 'Usuário'}</span>
            <span class="logout-btn" onclick="logout()">Sair</span>
        </div>
    </nav>
    `;

    // Insere no topo do body
    document.body.insertAdjacentHTML('afterbegin', navHTML);
}

function isActive(page) {
    return window.location.pathname.includes(page) ? 'active' : '';
}

// Executa ao carregar
document.addEventListener("DOMContentLoaded", () => {
    renderNavbar();
});
