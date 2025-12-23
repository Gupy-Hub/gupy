function renderNavbar() {
    if(window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) return;
    const navHTML = `
    <nav class="navbar">
        <div class="nav-left">
            <div class="brand" onclick="window.location.href='produtividade.html'" style="display:flex; align-items:center; cursor:pointer;">
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
            <span class="user-name">${SESSAO_ATUAL ? SESSAO_ATUAL.nome : 'Usuário'}</span>
            <span class="logout-btn" onclick="logout()">Sair</span>
        </div>
    </nav>`;
    document.body.insertAdjacentHTML('afterbegin', navHTML);
    const page = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav-item').forEach(link => {
        if(link.getAttribute('href') === page) link.classList.add('active');
    });
}
document.addEventListener("DOMContentLoaded", renderNavbar);
