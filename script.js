// Espera o DOM (a página) carregar completamente
document.addEventListener('DOMContentLoaded', () => {

  // --- 1. REFERÊNCIAS AOS ELEMENTOS ---
  const form = document.getElementById('form-gestao');
  const inputFuncao = document.getElementById('input-funcao');
  const inputNome = document.getElementById('input-nome');
  const inputPesquisa = document.getElementById('input-pesquisa');
  const tabelaCorpo = document.getElementById('tabela-corpo');
  const btnSalvar = document.getElementById('btn-salvar');
  const indiceEdicao = document.getElementById('indice-edicao');

  // --- 2. DADOS (Nosso "Banco de Dados" em memória) ---
  // Começamos com os dados que você forneceu
  let dados = [
    { funcao: "Capitão", nome: "Cristiano Ronaldo" },
    { funcao: "Juiz", nome: "Daronco" },
    { funcao: "Árbitro", nome: "Varmeira" },
    { funcao: "Time", nome: "Ibis" }
  ];

  // --- 3. FUNÇÕES PRINCIPAIS ---

  /**
  * Função para renderizar (desenhar) a tabela na tela.
  * Ela lê os dados da variável 'dados' e cria o HTML.
  */
  function renderizarTabela() {
    // Limpa a tabela antes de desenhar
    tabelaCorpo.innerHTML = '';
    
    // (CONSULTAR / PESQUISA) Filtra os dados baseado no campo de pesquisa
    const termoPesquisa = inputPesquisa.value.toLowerCase();

    const dadosFiltrados = dados.filter(item => {
      return item.funcao.toLowerCase().includes(termoPesquisa) ||
         item.nome.toLowerCase().includes(termoPesquisa);
    });

    // Cria uma linha (<tr>) para cada item nos dados filtrados
    dadosFiltrados.forEach((item, index) => {
      // Precisamos do índice real nos 'dados' originais, não nos filtrados
      const indiceOriginal = dados.indexOf(item);

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${item.funcao}</td>
        <td>${item.nome}</td>
        <td>
          <button class="btn-acao btn-alterar" data-index="${indiceOriginal}">Alterar</button>
          <button class="btn-acao btn-excluir" data-index="${indiceOriginal}">Excluir</button>
        </td>
      `;
      tabelaCorpo.appendChild(tr);
    });
  }

  /**
  * Função para lidar com o envio do formulário (Incluir e Alterar)
  */
  function handleFormSubmit(event) {
    event.preventDefault(); // Impede o recarregamento da página

    const funcao = inputFuncao.value;
    const nome = inputNome.value;
    const index = indiceEdicao.value; // Pega o índice do campo oculto

    if (index === '') {
      // --- INCLUIR (CREATE) ---
      // Adiciona o novo item ao array 'dados'
      dados.push({ funcao, nome });
    } else {
      // --- ALTERAR (UPDATE) ---
      // Atualiza o item existente no array 'dados'
      dados[index] = { funcao, nome };
      
      // Limpa o índice e reseta o formulário
      indiceEdicao.value = '';
      btnSalvar.textContent = 'Salvar';
    }

    // Limpa os campos do formulário
    form.reset();
    // Redesenha a tabela com os dados atualizados
    renderizarTabela();
  }

  /**
  * Função para lidar com cliques nos botões de Ação (Alterar e Excluir)
  */
  function handleAcoesClick(event) {
    const target = event.target; // O elemento clicado
    const index = target.getAttribute('data-index'); // O 'data-index' do botão

    if (target.classList.contains('btn-excluir')) {
      // --- EXCLUIR (DELETE) ---
      // Remove o item do array 'dados'
      dados.splice(index, 1);
      // Redesenha a tabela
      renderizarTabela();

    } else if (target.classList.contains('btn-alterar')) {
      // --- PREPARAR PARA ALTERAR (UPDATE) ---
      // Pega o item do array
      const item = dados[index];
      
      // Preenche o formulário com os dados do item
      inputFuncao.value = item.funcao;
      inputNome.value = item.nome;
      indiceEdicao.value = index; // Armazena o índice no campo oculto
      
      // Muda o texto do botão
      btnSalvar.textContent = 'Salvar Alteração';
      
      // Rola a página para o topo (para o formulário)
      window.scrollTo(0, 0);
    }
  }

  // --- 4. EVENT LISTENERS (Monitores de Eventos) ---

  // Monitora o envio do formulário
  form.addEventListener('submit', handleFormSubmit);

  // Monitora cliques na tabela (para os botões de ação)
  // Usamos "delegação de evento" para monitorar cliques no 'tbody'
  tabelaCorpo.addEventListener('click', handleAcoesClick);

  // Monitora digitação no campo de pesquisa
  inputPesquisa.addEventListener('input', renderizarTabela);


  // --- 5. INICIALIZAÇÃO ---
  // Desenha a tabela pela primeira vez quando a página carrega
  renderizarTabela();

});