/**
 * assets/js/layout.js
 * ATUALIZADO: Inclui o link para o sistema de Frases
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

    // HTML da Navbar
    const navHTML = `
    <nav class="navbar">
        <div class="nav-container">
            
            ${typeof getLogoHTML === 'function' ? getLogoHTML() : '<div class="brand">Gupy</div>'}
            
            <div class="nav-links">
                <a href="gestao.html" class="nav-item">Gestão</a>
                <a href="produtividade.html" class="nav-item">Produtividade</a>
                <a href="performance.html" class="nav-item">Performance</a>
                
                <a href="frases.html" class="nav-item" style="color: #60a5fa; font-weight: 700; border-bottom: 2px solid transparent;">
                    💬 Frases & Chat
                </a>
                
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

    // Marca link ativo
    const page = path.split('/').pop();
    document.querySelectorAll('.nav-item').forEach(link => {
        const href = link.getAttribute('href');
        if (href === page) {
            link.classList.add('active');
        }
    });
}

// Pequena função auxiliar para logout (caso não exista no escopo global)
if (typeof logout !== 'function') {
    window.logout = function() {
        localStorage.removeItem('usuario');
        localStorage.removeItem('gupy_session'); // Limpa também a sessão do novo sistema
        window.location.href = 'index.html';
    }
}

document.addEventListener("DOMContentLoaded", renderNavbar);
