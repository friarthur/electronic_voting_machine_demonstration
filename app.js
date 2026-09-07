// ============================================================
// JS — SIMULAÇÃO EDUCACIONAL URNA ELETRÔNICA
// Módulos: estado, candidatos, teclado, validação, pipeline,
// criptografia, integridade, interface, acessibilidade, reset
// ============================================================

// -------- CONFIGURAÇÕES --------
const CONFIG = {
    MAX_DIGITS: 5,
    CONFIRM_DELAY: 1000,        // 1s de bloqueio para conferência
    PIPELINE_INTERVAL: 700,     // ms entre etapas do pipeline
};

// -------- ESTADO CENTRAL --------
const state = {
    digitado: '',
    candidatoAtual: null,
    etapaAtual: 0,              // 0 = votação, 1..7 pipeline
    votoAtual: null,
    processando: false,
    etapaPipeline: 0,           // 0..7 (0 = entrada, 7 = concluído)
    votosRegistrados: [],
    pipelineConcluido: false,
    conferenciaLiberada: false,
    votoEmBranco: false,
    votoNulo: false,
    detalhesTecnicos: null,
    hashGerado: null,
};

// -------- CANDIDATOS FICTÍCIOS --------
const candidatos = {
    '16': {
        numero: '16',
        nome: 'João da Silva',
        partido: 'ABC',
        cargo: 'Vereador',
        foto: '👤',
    },
    '25': {
        numero: '25',
        nome: 'Maria Oliveira',
        partido: 'XYZ',
        cargo: 'Prefeita',
        foto: '👩',
    },
    '42': {
        numero: '42',
        nome: 'Carlos Mendes',
        partido: 'DEF',
        cargo: 'Governador',
        foto: '🧑',
    },
    '55': {
        numero: '55',
        nome: 'Ana Souza',
        partido: 'GHI',
        cargo: 'Presidente',
        foto: '👩‍💼',
    },
};

// -------- BACKEND ADAPTER (futuro PHP) --------
const backendAdapter = {
    // futuramente: POST para PHP
    saveVote(vote) {
        console.log('[backendAdapter] Voto simulado:', vote);
        return { success: true, id: Date.now() };
    },
};

// -------- DOM CACHE --------
const screenEl = document.getElementById('screen');
const btnConfirm = document.getElementById('btnConfirm');
const btnCorrect = document.getElementById('btnCorrect');
const btnBlank = document.getElementById('btnBlank');
const soundCheck = document.getElementById('soundCheck');

// -------- ÁUDIO (Web Audio) --------
let audioCtx = null;

function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playBeep(freq = 800, duration = 0.08, type = 'sine') {
    if (!soundCheck.checked) return;
    try {
        initAudio();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = 0.12;
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    } catch (_) { /* fallback silencioso */ }
}

function playKeySound() { playBeep(700, 0.06); }
function playConfirmSound() { playBeep(1000, 0.15); }
function playErrorSound() { playBeep(300, 0.2, 'sawtooth'); }
function playSuccessSound() { playBeep(1200, 0.12); playBeep(1500, 0.12); }

// -------- UTILITÁRIOS --------
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function gerarHashSimulado(dados) {
    // Simulação de hash com Web Crypto API (SHA-256)
    const str = JSON.stringify(dados);
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))
        .then(buffer => {
            const hex = Array.from(new Uint8Array(buffer))
                .map(b => b.toString(16).padStart(2, '0')).join('');
            return hex;
        })
        .catch(() => {
            // fallback simulado
            const fake = '7c9e6679' + Math.random().toString(16).slice(2, 10);
            return fake.padEnd(64, '0');
        });
}

function gerarCriptografiaSimulada(dados) {
    // Demonstração didática: apenas um placeholder
    const str = JSON.stringify(dados);
    let encoded = '';
    for (let i = 0; i < str.length; i++) {
        encoded += str.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return 'crypt_' + encoded.slice(0, 40) + '...';
}

// -------- FUNÇÕES DE INTERFACE --------
function renderScreen(html) {
    screenEl.innerHTML = `<div class="screen-content">${html}</div>`;
}

function telaInicio() {
    renderScreen(`
        <div class="screen-title">VOTAÇÃO</div>
        <div class="screen-sub">Digite o número do candidato</div>
        <div class="screen-digits">${state.digitado.padEnd(CONFIG.MAX_DIGITS, ' ')}</div>
        ${state.candidatoAtual ? cardCandidato(state.candidatoAtual) : ''}
        ${state.votoEmBranco ? '<div class="screen-sub" style="color:#b71c1c;">VOTO EM BRANCO</div>' : ''}
        ${state.votoNulo ? '<div class="screen-sub error">NÚMERO NÃO ENCONTRADO</div>' : ''}
    `);
    atualizarBotoes();
}

function cardCandidato(cand) {
    if (!cand) return '';
    return `
        <div class="candidate-card">
            <div class="cargo">${cand.cargo}</div>
            <div class="candidate-foto">${cand.foto || '👤'}</div>
            <div class="nome">${cand.nome}</div>
            <div class="partido">${cand.partido}</div>
            <div style="font-size:1.2rem; font-weight:600;">${cand.numero}</div>
        </div>
    `;
}

function telaConferencia(cand) {
    const isNulo = state.votoNulo;
    const isBranco = state.votoEmBranco;
    let titulo = 'CONFIRA SEU VOTO';
    let conteudo = '';
    if (isBranco) {
        conteudo = `<div style="font-size:2rem;">⚪</div><div class="screen-sub">VOTO EM BRANCO</div>`;
    } else if (isNulo) {
        conteudo = `<div class="error" style="font-size:1.5rem;">NÚMERO NÃO ENCONTRADO</div>
                    <div class="screen-sub">Se confirmado, este voto será registrado como NULO.</div>`;
    } else if (cand) {
        conteudo = cardCandidato(cand);
    }
    renderScreen(`
        <div class="screen-title" style="font-size:1.5rem;">${titulo}</div>
        ${conteudo}
        <div style="margin-top:0.5rem; font-size:0.9rem; color:#5a4d3e;">
            ${state.conferenciaLiberada ? '✅ CONFIRMA disponível' : '⏳ Aguarde...'}
        </div>
    `);
    atualizarBotoes();
}

function telaPipeline(etapa, dados) {
    const etapas = [
        { id: 0, label: '01 — ENTRADA', desc: 'Recebendo voto...', status: '✓' },
        { id: 1, label: '02 — VALIDAÇÃO', desc: 'Verificando número informado', status: '✓' },
        { id: 2, label: '03 — IDENTIFICAÇÃO', desc: 'Associando voto ao registro', status: '✓' },
        { id: 3, label: '04 — INTEGRIDADE', desc: 'Gerando assinatura/hash', status: '✓' },
        { id: 4, label: '05 — CRIPTOGRAFIA', desc: 'Protegendo dados sensíveis', status: '✓' },
        { id: 5, label: '06 — REGISTRO', desc: 'Armazenando voto', status: '✓' },
        { id: 6, label: '07 — CONCLUÍDO', desc: 'VOTO REGISTRADO', status: '✓' },
    ];
    const e = etapas[etapa] || etapas[0];
    let extra = '';
    if (etapa === 3 && state.hashGerado) {
        extra = `<div class="pipeline-hash">${state.hashGerado.slice(0, 16)}...</div>`;
    }
    if (etapa === 4) {
        extra = `<div style="font-family:monospace; font-size:0.8rem;">███████████████</div>`;
    }
    if (etapa === 6) {
        extra = `<div class="success">✓ VOTO REGISTRADO COM SUCESSO</div>`;
    }
    renderScreen(`
        <div class="pipeline-card">
            <div class="pipeline-step">${e.label}</div>
            <div class="pipeline-desc">${e.desc}</div>
            ${extra}
            <div class="pipeline-status">${e.status}</div>
            ${dados ? `<div style="font-size:0.8rem; color:#3d352c;">${dados}</div>` : ''}
        </div>
        ${etapa === 6 ? `
            <div style="margin-top:0.6rem;">
                <button class="action action-confirm" id="btnDetalhes" style="font-size:0.8rem; padding:0.3rem 1rem;">VER DETALHES TÉCNICOS</button>
                <button class="action action-correct" id="btnNovaSimulacao" style="font-size:0.8rem; padding:0.3rem 1rem;">NOVA SIMULAÇÃO</button>
            </div>
        ` : ''}
    `);
    atualizarBotoes();
    // Eventos dinâmicos
    if (etapa === 6) {
        document.getElementById('btnDetalhes')?.addEventListener('click', mostrarDetalhesTecnicos);
        document.getElementById('btnNovaSimulacao')?.addEventListener('click', resetVotacao);
    }
}

function mostrarDetalhesTecnicos() {
    if (!state.detalhesTecnicos) return;
    const d = state.detalhesTecnicos;
    renderScreen(`
        <div style="width:100%; text-align:left;">
            <details class="tech-details" open>
                <summary>🔍 DETALHES TÉCNICOS (SIMULAÇÃO)</summary>
                <div style="margin-top:0.3rem; font-size:0.85rem;">
                    <div><strong>Número informado:</strong> ${d.numero || 'branco'}</div>
                    <div><strong>Tipo:</strong> ${d.tipo}</div>
                    <div><strong>Identificador interno:</strong> ${d.id || 'N/A'}</div>
                    <div><strong>Hash de integridade:</strong> <span style="font-family:monospace;font-size:0.75rem;">${d.hash || 'N/A'}</span></div>
                    <div><strong>Dados cifrados:</strong> <span style="font-family:monospace;font-size:0.7rem;">${d.cifrado || 'N/A'}</span></div>
                    <div><strong>Timestamp:</strong> ${d.timestamp || new Date().toLocaleString()}</div>
                    <div><strong>Status:</strong> ${d.status || 'REGISTRADO'}</div>
                </div>
                <div class="tech-note">Os dados abaixo são simulados para fins educacionais.</div>
            </details>
            <div style="margin-top:0.6rem;">
                <button class="action action-correct" id="btnFecharDetalhes" style="font-size:0.8rem; padding:0.2rem 1rem;">FECHAR</button>
                <button class="action action-confirm" id="btnNovaSimulacao2" style="font-size:0.8rem; padding:0.2rem 1rem;">NOVA SIMULAÇÃO</button>
            </div>
        </div>
    `);
    document.getElementById('btnFecharDetalhes')?.addEventListener('click', () => telaPipeline(6, null));
    document.getElementById('btnNovaSimulacao2')?.addEventListener('click', resetVotacao);
}

// -------- ATUALIZAR BOTÕES --------
function atualizarBotoes() {
    const isPipeline = state.etapaPipeline > 0 && state.etapaPipeline < 6;
    const isConcluido = state.etapaPipeline === 6;
    const isConferencia = state.conferenciaLiberada === false && state.digitado.length > 0;
    btnConfirm.disabled = true;
    btnCorrect.disabled = false;
    btnBlank.disabled = false;

    if (state.processando || isPipeline || isConcluido) {
        btnConfirm.disabled = true;
        btnCorrect.disabled = true;
        btnBlank.disabled = true;
        return;
    }

    // Durante conferência (1s de bloqueio)
    if (state.digitado.length > 0 && state.conferenciaLiberada === false) {
        btnConfirm.disabled = true;
        btnCorrect.disabled = false;
        btnBlank.disabled = true;
        return;
    }

    if (state.conferenciaLiberada && state.digitado.length > 0) {
        btnConfirm.disabled = false;
        btnCorrect.disabled = false;
        btnBlank.disabled = true;
        return;
    }

    // Voto em branco ou nulo
    if (state.votoEmBranco || state.votoNulo) {
        btnConfirm.disabled = false;
        btnCorrect.disabled = false;
        btnBlank.disabled = true;
        return;
    }

    // Votação normal
    if (state.digitado.length === 0) {
        btnConfirm.disabled = true;
        btnBlank.disabled = false;
    } else {
        btnConfirm.disabled = true; // só libera após conferência
        btnBlank.disabled = true;
    }
}

// -------- LÓGICA DE VOTAÇÃO --------
function handleDigit(digit) {
    if (state.processando || state.etapaPipeline > 0) return;
    if (state.digitado.length >= CONFIG.MAX_DIGITS) {
        playErrorSound();
        return;
    }
    state.digitado += digit;
    state.votoEmBranco = false;
    state.votoNulo = false;
    state.conferenciaLiberada = false;
    playKeySound();
    // Verifica se número existe
    const num = state.digitado;
    const cand = candidatos[num];
    if (cand) {
        state.candidatoAtual = cand;
        state.votoNulo = false;
        telaConferencia(cand);
        // Bloqueio de 1s
        state.conferenciaLiberada = false;
        setTimeout(() => {
            state.conferenciaLiberada = true;
            atualizarBotoes();
            if (state.etapaPipeline === 0 && !state.processando) {
                telaConferencia(cand);
            }
        }, CONFIG.CONFIRM_DELAY);
    } else if (state.digitado.length === CONFIG.MAX_DIGITS) {
        // Número inválido (nulo)
        state.candidatoAtual = null;
        state.votoNulo = true;
        state.conferenciaLiberada = false;
        telaConferencia(null);
        playErrorSound();
        setTimeout(() => {
            state.conferenciaLiberada = true;
            atualizarBotoes();
            if (state.etapaPipeline === 0 && !state.processando) {
                telaConferencia(null);
            }
        }, CONFIG.CONFIRM_DELAY);
    } else {
        state.candidatoAtual = null;
        state.votoNulo = false;
        telaInicio();
    }
    atualizarBotoes();
}

function handleCorrect() {
    if (state.processando) return;
    if (state.etapaPipeline > 0) {
        if (state.etapaPipeline === 6) {
            resetVotacao();
        }
        return;
    }
    state.digitado = '';
    state.candidatoAtual = null;
    state.votoEmBranco = false;
    state.votoNulo = false;
    state.conferenciaLiberada = false;
    playKeySound();
    telaInicio();
    atualizarBotoes();
}

function handleBlank() {
    if (state.processando || state.etapaPipeline > 0) return;
    state.votoEmBranco = true;
    state.votoNulo = false;
    state.candidatoAtual = null;
    state.digitado = 'BRANCO';
    state.conferenciaLiberada = false;
    telaConferencia(null);
    playKeySound();
    setTimeout(() => {
        state.conferenciaLiberada = true;
        atualizarBotoes();
        if (state.etapaPipeline === 0 && !state.processando) {
            telaConferencia(null);
        }
    }, CONFIG.CONFIRM_DELAY);
    atualizarBotoes();
}

async function handleConfirm() {
    if (state.processando) return;
    if (state.etapaPipeline > 0) return;
    if (!state.conferenciaLiberada) return;

    // Verifica se é branco, nulo ou válido
    const isBranco = state.votoEmBranco;
    const isNulo = state.votoNulo || (!state.candidatoAtual && state.digitado.length > 0 && state.digitado !== 'BRANCO');
    const cand = state.candidatoAtual;

    if (!isBranco && !isNulo && !cand) {
        playErrorSound();
        return;
    }

    // Prepara voto
    const numeroVoto = isBranco ? 'BRANCO' : (isNulo ? 'NULO' : cand.numero);
    const tipo = isBranco ? 'Branco' : (isNulo ? 'Nulo' : 'Nominal');

    state.votoAtual = {
        numero: numeroVoto,
        tipo: tipo,
        candidato: cand,
        timestamp: new Date().toISOString(),
        id: 'ID-' + String(Math.floor(Math.random() * 9000) + 1000),
    };

    state.processando = true;
    state.conferenciaLiberada = false;
    playConfirmSound();
    await executarPipeline(state.votoAtual);
}

// -------- PIPELINE --------
async function executarPipeline(voto) {
    state.etapaPipeline = 0;
    state.processando = true;
    atualizarBotoes();

    // Etapa 0: ENTRADA
    telaPipeline(0, `Número: ${voto.numero}`);
    await sleep(CONFIG.PIPELINE_INTERVAL);

    // Etapa 1: VALIDAÇÃO
    const valido = voto.tipo !== 'Nulo' || voto.numero !== 'NULO';
    telaPipeline(1, valido ? '✓ Válido' : '✗ Inválido (nulo)');
    await sleep(CONFIG.PIPELINE_INTERVAL);

    // Etapa 2: IDENTIFICAÇÃO
    const idInterno = 'ID-' + String(Math.floor(Math.random() * 9000) + 1000);
    telaPipeline(2, `ID: ${idInterno}`);
    await sleep(CONFIG.PIPELINE_INTERVAL);

    // Etapa 3: INTEGRIDADE (hash)
    const dadosHash = {
        numero: voto.numero,
        id: idInterno,
        timestamp: voto.timestamp,
    };
    const hash = await gerarHashSimulado(dadosHash);
    state.hashGerado = hash;
    telaPipeline(3, `Hash: ${hash.slice(0, 16)}...`);
    await sleep(CONFIG.PIPELINE_INTERVAL);

    // Etapa 4: CRIPTOGRAFIA
    const cifrado = gerarCriptografiaSimulada(dadosHash);
    telaPipeline(4, `Dados protegidos`);
    await sleep(CONFIG.PIPELINE_INTERVAL);

    // Etapa 5: REGISTRO
    const registro = {
        ...voto,
        id: idInterno,
        hash: hash,
        cifrado: cifrado,
        status: 'REGISTRADO',
    };
    state.detalhesTecnicos = registro;
    // Salva no backendAdapter (futuro PHP)
    backendAdapter.saveVote(registro);
    state.votosRegistrados.push(registro);
    telaPipeline(5, `Registro #${registro.id}`);
    await sleep(CONFIG.PIPELINE_INTERVAL);

    // Etapa 6: CONCLUÍDO
    state.etapaPipeline = 6;
    telaPipeline(6, null);
    playSuccessSound();
    state.processando = false;
    state.pipelineConcluido = true;
    atualizarBotoes();
}

// -------- RESET --------
function resetVotacao() {
    state.digitado = '';
    state.candidatoAtual = null;
    state.etapaAtual = 0;
    state.votoAtual = null;
    state.processando = false;
    state.etapaPipeline = 0;
    state.pipelineConcluido = false;
    state.conferenciaLiberada = false;
    state.votoEmBranco = false;
    state.votoNulo = false;
    state.detalhesTecnicos = null;
    state.hashGerado = null;
    playKeySound();
    telaInicio();
    atualizarBotoes();
}

// -------- TESTE DE INTEGRIDADE (demonstração) --------
async function runIntegrityTest() {
    const original = { numero: '16', timestamp: '2026-09-07' };
    const hash1 = await gerarHashSimulado(original);
    const modificado = { ...original, numero: '17' };
    const hash2 = await gerarHashSimulado(modificado);
    console.log('🔒 TESTE INTEGRIDADE:');
    console.log('Original hash:', hash1);
    console.log('Modificado hash:', hash2);
    console.log('Integridade:', hash1 === hash2 ? '❌ VIOLADA' : '✅ PRESERVADA');
    return { hash1, hash2, integro: hash1 === hash2 };
}
// expõe para console
window.runIntegrityTest = runIntegrityTest;

// -------- EVENTOS TECLADO FÍSICO --------
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        handleConfirm();
    } else if (e.key === 'Backspace' || e.key === 'Escape') {
        e.preventDefault();
        handleCorrect();
    } else if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleBlank();
    }
});

// -------- EVENTOS BOTÕES --------
document.querySelectorAll('.key[data-digit]').forEach(btn => {
    btn.addEventListener('click', () => {
        const digit = btn.dataset.digit;
        if (digit !== undefined) handleDigit(digit);
    });
});

btnConfirm.addEventListener('click', handleConfirm);
btnCorrect.addEventListener('click', handleCorrect);
btnBlank.addEventListener('click', handleBlank);

// -------- INICIALIZAÇÃO --------
function init() {
    resetVotacao();
    // Pequeno teste de integridade no console
    runIntegrityTest().then(r => {
        console.log('✅ Teste integridade executado (simulação)');
    });
}

// Inicia quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}