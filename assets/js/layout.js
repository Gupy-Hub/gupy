/**
 * assets/js/layout.js
 * ATUALIZADO: Layout limpo sem estilos inline para permitir responsividade via CSS.
 */

function renderNavbar() {
    // Evita renderizar duas vezes
    if (document.querySelector('.navbar')) return;

    const path = window.location.pathname;
    // Não renderiza na tela de login
    if (path.includes('index.html') || (path.endsWith('/') && path.length < 2) || path === '/') {
        return;
    }

    // Identifica usuário
    let nomeUsuario = 'Colaborador';
    if (typeof SESSAO_ATUAL !== 'undefined' && SESSAO_ATUAL && SESSAO_ATUAL.nome) {
        nomeUsuario = SESSAO_ATUAL.nome;
    } else if (localStorage.getItem('usuario')) {
        try {
            const u = JSON.parse(localStorage.getItem('usuario'));
            nomeUsuario = u.nome || 'Colaborador';
        } catch (e) { console.error(e); }
    }

    // HTML da Navbar (Sem estilos inline de altura/width)
    const navHTML = `
    <nav class="navbar">
        <div class="nav-container">
            <div class="brand" onclick="window.location.href='produtividade.html'">
                <img src="assets/img/logo.png" alt="Logo" class="logo-nav">
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

    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // Marca o link ativo
    const page = path.split('/').pop();
    document.querySelectorAll('.nav-item').forEach(link => {
        const href = link.getAttribute('href');
        if (href === page || (page === '' && href === 'produtividade.html')) {
            link.classList.add('active');
        }
    });
}

document.addEventListener("DOMContentLoaded", renderNavbar);
