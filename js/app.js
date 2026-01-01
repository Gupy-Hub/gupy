// js/app.js - Controlador Principal Unificado

let usuarioLogado = null;
let abaAtiva = 'dashboard';

window.onload = function() {
    verificarLogin();
};

function verificarLogin() {
    let s = localStorage.getItem('gupy_session');
    
    // Tenta migrar sessão antiga se existir
    if (!s && localStorage.getItem('usuario')) {
        const old = JSON.parse(localStorage.getItem('usuario'));
        const novo = {
            id: old.id,
            username: old.id.toString(),
            nome: old.nome,
            perfil: old.funcao === 'Gestora' ? 'admin' : 'user',
            ativo: true
        };
        localStorage.setItem('gupy_session', JSON.stringify(novo));
        s = JSON.stringify(novo);
    }

    if (s) {
        usuarioLogado = JSON.parse(s);
        document.getElementById('login-flow').classList.add('hidden');
        inicializarSistema();
    } else {
        document.getElementById('login-flow').classList.remove('hidden');
    }
}

async function fazerLogin() {
    const u = document.getElementById('login-user').value;
    const p = document.getElementById('login-pass').value;
    
    // Busca na tabela usuarios (que agora serve para ambos)
    const { data, error } = await _supabase.from('usuarios').select('*').eq('id', u).eq('senha', p).maybeSingle();
    
    if (data) {
        // Normaliza dados
        const user = {
            id: data.id,
            username: data.id.toString(),
            nome: data.nome,
            perfil: data.funcao === 'Gestora' ? 'admin' : 'user',
            ativo: true
        };
        localStorage.setItem('gupy_session', JSON.stringify(user));
        location.reload();
    } else {
        alert('Dados inválidos');
    }
}

function inicializarSistema() {
    // Preenche Sidebar
    document.getElementById('nome-sidebar').innerText = usuarioLogado.nome;
    document.getElementById('perfil-sidebar').innerText = usuarioLogado.perfil === 'admin' ? 'Gestão' : 'Colaborador';
    document.getElementById('avatar-sidebar').innerText = usuarioLogado.nome.charAt(0);

    // Esconde menus de admin se for user comum
    if (usuarioLogado.perfil !== 'admin') {
        document.getElementById('menu-equipe').classList.add('hidden');
        document.getElementById('menu-logs').classList.add('hidden');
    }

    // Carrega aba inicial
    navegar('dashboard');
    
    // Inicia Chat
    if (typeof iniciarChat === 'function') iniciarChat();
}

function navegar(aba) {
    abaAtiva = aba;
    
    // UI: Esconde todas as sections
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    document.getElementById(`view-${aba}`).classList.remove('hidden');
    
    // UI: Atualiza Sidebar (classe ativa)
    document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('tab-active', 'bg-slate-800', 'text-white'));
    const btnMenu = document.getElementById(`menu-${aba}`);
    if(btnMenu) btnMenu.classList.add('tab-active');

    // Título da Página
    document.getElementById('page-title').innerText = aba.charAt(0).toUpperCase() + aba.slice(1);

    // Lógica Específica de cada aba
    if (aba === 'dashboard') carregarDashboard();
    if (aba === 'biblioteca') carregarFrases();
    if (aba === 'logs') carregarLogs();
    if (aba === 'equipe') { carregarEquipe(); Gestao.init(); }
    
    // Módulos Portados (Novo Arquivo)
    if (aba === 'produtividade') Produtividade.init();
    if (aba === 'performance') Performance.init();
    if (aba === 'consolidado') Consolidado.init();
}

function logout() {
    localStorage.clear();
    location.reload();
}
