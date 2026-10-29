// Seleciona o formulário que contém os filtros
const formFiltros = document.getElementById('form-filtros')

// Seleciona os filtros de ano, mês e semana
const filtroAno = document.getElementById('filtro-ano')
const filtroMes = document.getElementById('filtro-mes')
const filtroSemana = document.getElementById('filtro-semana')

// Guarda a semana selecionada que foi enviada pelo Flask
const semanaSelecionada = filtroSemana.dataset.semana

// Seleciona os botões de ordenação da tabela
const ordenarData = document.getElementById('ordenar-data')
const ordenarValor = document.getElementById('ordenar-valor')

// Seleciona o corpo da tabela de histórico
const tabelaHistorico = document.getElementById('tabela-historico')

// Define os valores iniciais da ordenação
let ordemData = 'desc'
let ordemValor = 'desc'

// Formata uma data para o formato dia/mês
function formatarData(data) {
    const dia = String(data.getDate()).padStart(2, '0')
    const mes = String(data.getMonth() + 1).padStart(2, '0')

    return dia + '/' + mes
}

// Preenche o filtro de semanas de acordo com o ano e o mês
function atualizarSemanas(semanaAtual = '') {

    // Limpa as opções anteriores
    filtroSemana.innerHTML = '<option value="">Selecione a semana</option>'

    // Obtém os valores selecionados
    const ano = Number(filtroAno.value)
    const mes = Number(filtroMes.value)

    // Desativa o filtro caso o ano ou o mês não esteja selecionado
    if (!ano || !mes) {
        filtroSemana.disabled = true
        return
    }

    // Ativa o filtro de semana
    filtroSemana.disabled = false

    // Descobre o primeiro e o último dia do mês
    const primeiroDia = new Date(ano, mes - 1, 1)
    const ultimoDia = new Date(ano, mes, 0)

    // Encontra o domingo da primeira semana do mês
    const primeiroDomingo = new Date(ano, mes - 1, 1 - primeiroDia.getDay())

    // Começa a contagem pela primeira semana
    let numeroSemana = 1

    // Percorre todas as semanas do mês
    for (let inicio = new Date(primeiroDomingo); inicio <= ultimoDia; inicio.setDate(inicio.getDate() + 7)) {

        // Calcula o sábado correspondente ao domingo da semana
        const fim = new Date(inicio)
        fim.setDate(fim.getDate() + 6)

        // Mantém as datas apresentadas dentro do mês selecionado
        const inicioExibicao = inicio < primeiroDia ? primeiroDia : inicio
        const fimExibicao = fim > ultimoDia ? ultimoDia : fim

        // Cria uma opção para a semana
        const opcao = document.createElement('option')

        // Define o número da semana como valor
        opcao.value = numeroSemana

        // Mostra o número da semana e o período correspondente
        opcao.textContent = 'Semana ' + numeroSemana + ' (' +
            formatarData(inicioExibicao) + ' - ' +
            formatarData(fimExibicao) + ')'

        // Adiciona a semana ao filtro
        filtroSemana.appendChild(opcao)

        // Avança para a próxima semana
        numeroSemana++
    }

    // Mantém a semana selecionada após atualizar a página
    filtroSemana.value = semanaAtual
}

// Ativa ou desativa o filtro de mês conforme o ano selecionado
filtroMes.disabled = !filtroAno.value

// Carrega as semanas do período enviado pelo Flask
atualizarSemanas(semanaSelecionada)

// Quando o ano é alterado, mostra todas as movimentações daquele ano
filtroAno.addEventListener('change', function() {

    // Limpa o mês e a semana anteriores
    filtroMes.value = ''
    filtroSemana.value = ''

    // Ativa o mês somente quando existe um ano selecionado
    filtroMes.disabled = !filtroAno.value

    // Limpa as semanas anteriores
    atualizarSemanas()

    // Envia o formulário para atualizar os dados do ano
    formFiltros.submit()
})

// Quando o mês é alterado, mostra todas as movimentações daquele mês
filtroMes.addEventListener('change', function() {

    // Limpa a semana anteriormente selecionada
    filtroSemana.value = ''

    // Atualiza as semanas disponíveis para o mês escolhido
    atualizarSemanas()

    // Envia o formulário para atualizar os dados do mês
    formFiltros.submit()
})

// Quando a semana é alterada, atualiza os registros do período
filtroSemana.addEventListener('change', function() {

    // Envia o formulário com a semana selecionada
    // Se a semana estiver vazia, mostra o mês inteiro
    formFiltros.submit()
})

// Ordena as movimentações pela data
ordenarData.addEventListener('click', function() {

    // Obtém todas as movimentações que aparecem na tabela
    const linhas = document.querySelectorAll('.item-historico')
    const listaLinhas = Array.from(linhas)

    // Organiza as linhas de acordo com as datas
    listaLinhas.sort(function(linha1, linha2) {

        // Obtém as datas no formato dia/mês/ano
        const data1 = linha1.dataset.data
        const data2 = linha2.dataset.data

        // Converte as datas para ano-mês-dia, permitindo compará-las
        const dataFormatada1 = data1.split('/').reverse().join('-')
        const dataFormatada2 = data2.split('/').reverse().join('-')

        // Verifica se a ordenação será crescente ou decrescente
        if (ordemData == 'asc') {
            return dataFormatada1.localeCompare(dataFormatada2)
        } else {
            return dataFormatada2.localeCompare(dataFormatada1)
        }
    })

    // Reorganiza as linhas da tabela na ordem calculada
    listaLinhas.forEach(function(linha) {
        tabelaHistorico.appendChild(linha)
    })

    // Alterna entre ordem crescente e decrescente
    if (ordemData == 'desc') {
        ordemData = 'asc'
    } else {
        ordemData = 'desc'
    }
})

// Ordena as movimentações pelo valor
ordenarValor.addEventListener('click', function() {

    // Obtém todas as movimentações que aparecem na tabela
    const linhas = document.querySelectorAll('.item-historico')
    const listaLinhas = Array.from(linhas)

    // Organiza as linhas de acordo com os valores
    listaLinhas.sort(function(linha1, linha2) {

        // Obtém os valores numéricos das movimentações
        const valor1 = Number(linha1.dataset.valor)
        const valor2 = Number(linha2.dataset.valor)

        // Verifica se a ordenação será crescente ou decrescente
        if (ordemValor == 'asc') {
            return valor1 - valor2
        } else {
            return valor2 - valor1
        }
    })

    // Reorganiza as linhas da tabela na ordem calculada
    listaLinhas.forEach(function(linha) {
        tabelaHistorico.appendChild(linha)
    })

    // Alterna entre ordem crescente e decrescente
    if (ordemValor == 'desc') {
        ordemValor = 'asc'
    } else {
        ordemValor = 'desc'
    }
})