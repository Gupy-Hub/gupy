// js/modulos_integrados.js
// Contém a lógica dos sistemas antigos (Produtividade, Performance, Gestão) adaptada para Tailwind

const Produtividade = {
    init: async function() {
        // Define data padrão se vazio
        const dateInput = document.getElementById('prod-date');
        if(!dateInput.value) dateInput.value = new Date().toISOString().split('T')[0];
        this.render();
    },

    render: async function() {
        const viewType = document.getElementById('prod-view-type').value;
        const dateVal = document.getElementById('prod-date').value;
        const tbody = document.getElementById('prod-table-body');
        
        tbody.innerHTML = '<tr><td colspan="8" class="text-center py-4 text-slate-400"><i class="fas fa-spinner fa-spin"></i> Carregando...</td></tr>';

        // Lógica de Data (Mesma do sistema antigo)
        let s, e;
        if(viewType === 'mes') {
            s = dateVal.substring(0, 7) + '-01';
            e = dateVal.substring(0, 7) + '-31'; // Simplificado
        } else {
            s = e = dateVal;
        }

        // Busca Dados
        const { data: producao } = await _supabase.from('producao')
            .select('*, usuarios(nome, funcao)')
            .gte('data_referencia', s).lte('data_referencia', e);

        // Agrupa por usuário (se for visão mês) ou lista direta
        let lista = [];
        if (viewType === 'dia') {
            lista = producao || [];
        } else {
            // Agregação simplificada para exemplo
            const map = {};
            producao.forEach(p => {
                if(!map[p.usuario_id]) map[p.usuario_id] = { ...p, quantidade: 0, fifo: 0 };
                map[p.usuario_id].quantidade += p.quantidade;
                map[p.usuario_id].fifo += p.fifo;
                // ... somar outros campos
            });
            lista = Object.values(map);
        }

        // Renderiza HTML Tailwind
        let html = '';
        if(lista.length === 0) html = '<tr><td colspan="8" class="text-center py-4">Sem dados.</td></tr>';
        
        lista.forEach(item => {
            if(!item.usuarios) return; // Segurança
            // Meta Fixa para exemplo (deve buscar do banco metas)
            const meta = 650 * (viewType === 'mes' ? 22 : 1); 
            const statusColor = item.quantidade >= meta ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600';
            const statusText = item.quantidade >= meta ? 'Sim' : 'Não';

            html += `
            <tr class="hover:bg-slate-50 transition">
                <td class="px-6 py-3 font-bold text-slate-700">${item.usuarios.nome}</td>
                <td class="px-6 py-3 text-center font-bold text-blue-600">${item.quantidade}</td>
                <td class="px-6 py-3 text-center">${item.fifo}</td>
                <td class="px-6 py-3 text-center">${item.gradual_total||0}</td>
                <td class="px-6 py-3 text-center">${item.gradual_parcial||0}</td>
                <td class="px-6 py-3 text-center">${item.perfil_fc||0}</td>
                <td class="px-6 py-3 text-center text-slate-400 font-bold">${meta}</td>
                <td class="px-6 py-3 text-center">
                    <span class="${statusColor} px-2 py-1 rounded text-xs font-bold uppercase">${statusText}</span>
                </td>
            </tr>`;
        });
        tbody.innerHTML = html;
    },

    importarExcel: async function(input) {
        // Reutiliza a lógica de importação do arquivo antigo, mas adaptada
        const file = input.files[0];
        if(!file) return;
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const json = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
            
            let count = 0;
            // Exemplo simples de inserção
            for(let row of json) {
                 if(row.id_assistente) {
                     // Extrai data do nome do arquivo ou usa hoje (Simplificado)
                     const dataRef = new Date().toISOString().split('T')[0]; 
                     await _supabase.from('producao').insert({
                         usuario_id: row.id_assistente,
                         quantidade: row.documentos_validados || 0,
                         data_referencia: dataRef
                         // ... outros campos
                     });
                     count++;
                 }
            }
            alert(`Importados ${count} registros!`);
            this.render();
        };
        reader.readAsArrayBuffer(file);
    }
};

const Performance = {
    init: async function() {
        // Carrega lista de usuários no select
        const { data: users } = await _supabase.from('usuarios').select('*').eq('funcao', 'Assistente');
        const sel = document.getElementById('perf-user');
        sel.innerHTML = users.map(u => `<option value="${u.id}">${u.nome}</option>`).join('');
        this.render();
    },

    render: async function() {
        const uid = document.getElementById('perf-user').value;
        const year = new Date().getFullYear();
        
        // Busca dados anuais
        const { data } = await _supabase.from('producao')
            .select('data_referencia, quantidade')
            .eq('usuario_id', uid)
            .gte('data_referencia', `${year}-01-01`);

        // Processa para Chart.js
        const labels = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
        const values = new Array(12).fill(0);
        
        let total = 0;
        data.forEach(d => {
            const mes = new Date(d.data_referencia).getMonth(); // 0-11
            values[mes] += d.quantidade;
            total += d.quantidade;
        });

        // Atualiza KPIs
        document.getElementById('perf-kpi-total').innerText = total.toLocaleString();
        document.getElementById('perf-kpi-media').innerText = Math.round(total / data.length || 0);

        // Renderiza Gráfico
        const ctx = document.getElementById('chart-performance');
        if(window.myPerfChart) window.myPerfChart.destroy();
        
        window.myPerfChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Produção Mensal',
                    data: values,
                    backgroundColor: '#3b82f6',
                    borderRadius: 4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
};

const Gestao = {
    init: async function() {
        // Preenche select de metas
        const { data: users } = await _supabase.from('usuarios').select('*').eq('funcao', 'Assistente');
        const sel = document.getElementById('meta-user-select');
        sel.innerHTML = '<option value="all">Todos os Assistentes</option>' + users.map(u => `<option value="${u.id}">${u.nome}</option>`).join('');
        this.listarMetas();
    },

    salvarMeta: async function() {
        const uid = document.getElementById('meta-user-select').value;
        const date = document.getElementById('meta-date').value;
        const val = document.getElementById('meta-val').value;

        if(!date || !val) return alert('Preencha os dados');

        let inserts = [];
        if(uid === 'all') {
             const { data: users } = await _supabase.from('usuarios').select('id').eq('funcao', 'Assistente');
             inserts = users.map(u => ({ usuario_id: u.id, data_inicio: date, valor_meta: val }));
        } else {
             inserts = [{ usuario_id: uid, data_inicio: date, valor_meta: val }];
        }

        await _supabase.from('metas').insert(inserts);
        alert('Meta gravada!');
        this.listarMetas();
    },

    listarMetas: async function() {
        const div = document.getElementById('lista-metas-vigentes');
        const { data } = await _supabase.from('metas').select('*, usuarios(nome)').order('data_inicio', {ascending:false}).limit(10);
        
        div.innerHTML = data.map(m => `
            <div class="flex justify-between border-b pb-1">
                <span>${m.usuarios ? m.usuarios.nome : 'Todos'}</span>
                <span class="font-bold text-blue-600">${m.valor_meta} (desde ${new Date(m.data_inicio).toLocaleDateString()})</span>
            </div>
        `).join('');
    }
};

const Consolidado = {
    init: function() { /* Lógica similar ao consolidado.html */ },
    gerar: function(tipo) { alert('Funcionalidade sendo portada para ' + tipo); }
};
