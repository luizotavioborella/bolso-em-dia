// Seleciona o formulário que contém os filtros
const formFiltros = document.getElementById('form-filtros')

// Seleciona os filtros de ano, mês e semana
const filtroAno = document.getElementById('filtro-ano')
const filtroMes = document.getElementById('filtro-mes')
const filtroSemana = document.getElementById('filtro-semana')

// Guarda a semana selecionada que foi enviada pelo Flask
const semanaSelecionada = filtroSemana.dataset.semana

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

// Quando o ano é alterado, limpa os filtros de mês e semana
filtroAno.addEventListener('change', function() {

    // Limpa o mês anterior
    filtroMes.value = ''

    // Ativa o mês somente quando existe um ano selecionado
    filtroMes.disabled = !filtroAno.value

    // Limpa e desativa as semanas anteriores
    atualizarSemanas()
})

// Quando o mês é alterado, atualiza as semanas disponíveis
filtroMes.addEventListener('change', function() {

    // Recria a lista de semanas do mês selecionado
    atualizarSemanas()
})

// Quando o usuário seleciona uma semana, aplica os filtros
filtroSemana.addEventListener('change', function() {

    // Envia os valores para o Flask quando uma semana é escolhida
    if (filtroSemana.value !== '') {
        formFiltros.submit()
    }
})