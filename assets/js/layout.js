/**
 * assets/js/layout.js
 * ATUALIZADO: Navbar responsiva com nova logo textual moderna.
 */

function renderNavbar() {
    // Evita renderizar duas vezes se já existir
    if (document.querySelector('.navbar')) return;

    const path = window.location.pathname;
    // Não renderiza na tela de login (index.html ou raiz)
    if (path.includes('index.html') || (path.endsWith('/') && path.length < 2) || path === '/') {
        return;
    }

    // Tenta identificar o usuário logado para mostrar no canto
    let nomeUsuario = 'Colaborador';
    if (typeof SESSAO_ATUAL !== 'undefined' && SESSAO_ATUAL && SESSAO_ATUAL.nome) {
        nomeUsuario = SESSAO_ATUAL.nome;
    } else if (localStorage.getItem('usuario')) {
        try {
            const u = JSON.parse(localStorage.getItem('usuario'));
            nomeUsuario = u.nome || 'Colaborador';
        } catch (e) { console.error(e); }
    }

    // HTML da Navbar (Estrutura limpa para CSS controlar)
    const navHTML = `
    <nav class="navbar">
        <div class="nav-container">
            <div class="brand logo-text-container" onclick="window.location.href='produtividade.html'" style="cursor: pointer;">
                <span class="logo-sub">Controle de</span>
                <span class="logo-main">Produtividade</span>
            </div>
            
            <div class="nav-links">
                <a href="gestao.html" class="nav-item">Gestão</a>
                <a href="produtividade.html" class="nav-item">Produtividade</a>
                <a href="performance.html" class="nav-item">Performance</a>
                <a href="consolidado.html" class="nav-item">Consolidado</a>
                <a href="minha_area.html" class="nav-item">Minha Área</a>
            </div>
        </div>
        
        <div class="user-area">
            <span class="user-name">${nomeUsuario}</span>
            <span class="logout-btn" onclick="logout()">Sair</span>
        </div>
    </nav>
    `;

    // Insere a navbar no início do body
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // Marca o link da página atual como ativo
    const page = path.split('/').pop();
    document.querySelectorAll('.nav-item').forEach(link => {
        const href = link.getAttribute('href');
        // Verifica se é a página atual OU se é a home (produtividade) quando o caminho está vazio
        if (href === page || (page === '' && href === 'produtividade.html')) {
            link.classList.add('active');
        }
    });
}

// Executa a função quando o HTML terminar de carregar
document.addEventListener("DOMContentLoaded", renderNavbar);
