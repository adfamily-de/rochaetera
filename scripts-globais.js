/**
 * ADVENTISTFAM - Scripts Globais
 * Família Missionária Adventista em Moçambique
 */

// ========================================
// CONTADOR DE VISITAS (LocalStorage)
// ========================================

function inicializarContadorVisitas() {
  const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
  const chaveContador = `visitas_${paginaAtual}`;
  
  // Recuperar contagem atual
  let contagem = parseInt(localStorage.getItem(chaveContador)) || 0;
  
  // Incrementar apenas se não for recarregamento na mesma sessão (últimos 30 min)
  const ultimaVisita = localStorage.getItem(`ultimaVisita_${paginaAtual}`);
  const agora = new Date().getTime();
  const trintaMinutos = 30 * 60 * 1000;
  
  if (!ultimaVisita || (agora - parseInt(ultimaVisita)) > trintaMinutos) {
    contagem++;
    localStorage.setItem(chaveContador, contagem);
    localStorage.setItem(`ultimaVisita_${paginaAtual}`, agora);
  }
  
  // Atualizar display
  atualizarDisplayContador(contagem);
}

function atualizarDisplayContador(contagem) {
  const display = document.getElementById('contador-visitas');
  if (display) {
    display.innerHTML = `<span>${contagem.toLocaleString()}</span> visitas`;
  }
}

// ========================================
// BOTÃO "ESTIVE AQUI, VOU ORAR"
// ========================================

function inicializarBotaoOrar() {
  const btnOrar = document.getElementById('btn-orar');
  const contadorOrar = document.getElementById('orar-contador');
  
  if (!btnOrar) return;
  
  // Recuperar contagem global de orações
  let oracoes = parseInt(localStorage.getItem('oracoes_adventistfam')) || 0;
  atualizarContadorOrar(oracoes);
  
  btnOrar.addEventListener('click', function() {
    // Verificar se já orou nesta sessão
    const jaOrou = sessionStorage.getItem('ja_orou_hoje');
    
    if (jaOrou) {
      mostrarMensagem('Você já indicou que vai orar hoje. Obrigado! 🙏', 'info');
      return;
    }
    
    // Incrementar contador
    oracoes++;
    localStorage.setItem('oracoes_adventistfam', oracoes);
    sessionStorage.setItem('ja_orou_hoje', 'true');
    
    // Atualizar display
    atualizarContadorOrar(oracoes);
    
    // Feedback visual
    mostrarMensagem('Obrigado! Sua oração faz toda a diferença. 🙏', 'sucesso');
    
    // Animação no botão
    btnOrar.style.transform = 'scale(1.1)';
    setTimeout(() => {
      btnOrar.style.transform = 'scale(1)';
    }, 300);
  });
}

function atualizarContadorOrar(oracoes) {
  const contadorOrar = document.getElementById('orar-contador');
  if (contadorOrar) {
    contadorOrar.textContent = `${oracoes.toLocaleString()} pessoas oraram`;
  }
}

// ========================================
// MENU MOBILE
// ========================================

function inicializarMenuMobile() {
  const toggle = document.getElementById('navbar-toggle');
  const menu = document.getElementById('navbar-menu');
  
  if (!toggle || !menu) return;
  
  toggle.addEventListener('click', function() {
    menu.classList.toggle('ativo');
    const estaAberto = menu.classList.contains('ativo');
    toggle.innerHTML = estaAberto ? '✕' : '☰';
  });
  
  // Fechar menu ao clicar em um link
  const links = menu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('ativo');
      toggle.innerHTML = '☰';
    });
  });
}

// ========================================
// ANIMAÇÃO DE ESTATÍSTICAS
// ========================================

function inicializarAnimacaoEstatisticas() {
  const estatisticas = document.querySelectorAll('.estatistica-numero');
  
  if (estatisticas.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animarNumero(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  estatisticas.forEach(stat => observer.observe(stat));
}

function animarNumero(elemento) {
  const valorFinal = parseInt(elemento.textContent) || 0;
  const duracao = 2000;
  const inicio = 0;
  const inicioTempo = performance.now();
  
  function atualizar(tempoAtual) {
    const decorrido = tempoAtual - inicioTempo;
    const progresso = Math.min(decorrido / duracao, 1);
    
    // Easing ease-out
    const easeOut = 1 - Math.pow(1 - progresso, 3);
    const valorAtual = Math.floor(inicio + (valorFinal - inicio) * easeOut);
    
    elemento.textContent = valorAtual.toLocaleString();
    
    if (progresso < 1) {
      requestAnimationFrame(atualizar);
    } else {
      elemento.textContent = valorFinal.toLocaleString();
    }
  }
  
  requestAnimationFrame(atualizar);
}

// ========================================
// MENSAGENS DE FEEDBACK
// ========================================

function mostrarMensagem(mensagem, tipo = 'info') {
  // Remover mensagem anterior se existir
  const mensagemAnterior = document.querySelector('.mensagem-feedback');
  if (mensagemAnterior) {
    mensagemAnterior.remove();
  }
  
  const div = document.createElement('div');
  div.className = `mensagem-feedback mensagem-${tipo}`;
  div.textContent = mensagem;
  
  // Estilos inline para a mensagem
  div.style.cssText = `
    position: fixed;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${tipo === 'sucesso' ? '#2C5F4A' : '#8B6914'};
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    z-index: 10000;
    font-weight: 500;
    animation: fadeIn 0.3s ease;
  `;
  
  document.body.appendChild(div);
  
  setTimeout(() => {
    div.style.opacity = '0';
    div.style.transition = 'opacity 0.3s ease';
    setTimeout(() => div.remove(), 300);
  }, 3000);
}

// ========================================
// COPIAR DADOS BANCÁRIOS
// ========================================

function inicializarCopiarDados() {
  const botoesCopiar = document.querySelectorAll('.btn-copiar');
  
  botoesCopiar.forEach(botao => {
    botao.addEventListener('click', function() {
      const texto = this.getAttribute('data-copiar');
      
      navigator.clipboard.writeText(texto).then(() => {
        const textoOriginal = this.textContent;
        this.textContent = 'Copiado!';
        this.style.backgroundColor = '#2C5F4A';
        
        setTimeout(() => {
          this.textContent = textoOriginal;
          this.style.backgroundColor = '';
        }, 2000);
        
        mostrarMensagem('Dado copiado para a área de transferência!', 'sucesso');
      }).catch(() => {
        mostrarMensagem('Não foi possível copiar. Tente manualmente.', 'erro');
      });
    });
  });
}

// ========================================
// SCROLL SUAVE
// ========================================

function inicializarScrollSuave() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const alvo = document.querySelector(href);
      if (alvo) {
        e.preventDefault();
        alvo.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// ========================================
// HEADER TRANSPARENTE NO SCROLL
// ========================================

function inicializarHeaderScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  
  let ultimoScroll = 0;
  
  window.addEventListener('scroll', () => {
    const scrollAtual = window.pageYOffset;
    
    if (scrollAtual > 100) {
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
      navbar.style.boxShadow = 'none';
    }
    
    ultimoScroll = scrollAtual;
  });
}

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener('DOMContentLoaded', function() {
  inicializarContadorVisitas();
  inicializarBotaoOrar();
  inicializarMenuMobile();
  inicializarAnimacaoEstatisticas();
  inicializarCopiarDados();
  inicializarScrollSuave();
  inicializarHeaderScroll();
});

// ========================================
// FUNÇÕES UTILITÁRIAS GLOBAIS
// ========================================

// Formatar número de telefone Moçambique
function formatarTelefoneMocambique(numero) {
  // Remove espaços e caracteres não numéricos
  const limpo = numero.replace(/\D/g, '');
  
  // Formato: +258 XX XXX XXXX
  if (limpo.length === 12 && limpo.startsWith('258')) {
    return `+${limpo.slice(0, 3)} ${limpo.slice(3, 5)} ${limpo.slice(5, 8)} ${limpo.slice(8)}`;
  }
  
  return numero;
}

// Compartilhar no WhatsApp
function compartilharWhatsApp(texto, url) {
  const textoCodificado = encodeURIComponent(texto + ' ' + url);
  window.open(`https://wa.me/?text=${textoCodificado}`, '_blank');
}

// Abrir link do WhatsApp com mensagem
function abrirWhatsApp(numero, mensagem = '') {
  const numeroLimpo = numero.replace(/\D/g, '');
  const url = `https://wa.me/${numeroLimpo}${mensagem ? '?text=' + encodeURIComponent(mensagem) : ''}`;
  window.open(url, '_blank');
}
