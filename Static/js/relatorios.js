 // Pega o seletor de anos do HTML pelo ID
const filtroAno = document.getElementById('filtro-ano')

// Pega os ganhos enviados pelo Python e transforma o JSON em um objeto JavaScript
const ganhosPorAno = JSON.parse(document.getElementById('ganhos-por-ano').textContent)

// Pega a lista dos meses enviada pelo Python
const meses = JSON.parse(document.getElementById('meses').textContent)

// Função para formatar os valores em reais
function formatarDinheiro(valor) {
    // Converte o valor em número e formata no padrão brasileiro
    return Number(valor).toLocaleString('pt-BR', {
        style: 'currency', // Define que o valor é uma moeda
        currency: 'BRL' // Define a moeda como real brasileiro
    })
}

// Função responsável por atualizar os dados dos relatórios
function atualizarRelatorios() {
    // Pega o ano selecionado no filtro
    const ano = filtroAno.value

    // Pega os ganhos mensais do ano selecionado
    const ganhos = ganhosPorAno[ano]

    // Encontra o maior valor entre os ganhos dos 12 meses
    const maiorValor = Math.max(...ganhos)

    // Descobre a posição do mês que teve o maior ganho
    const posicaoMaior = ganhos.indexOf(maiorValor)

    // Pega o nome do melhor mês ou mostra "Nenhum" caso não tenha ganhos
    const melhorMes = maiorValor > 0 ? meses[posicaoMaior] : 'Nenhum'

    // Atualiza o nome do melhor mês no HTML
    document.getElementById('melhor-mes').textContent = melhorMes

    // Atualiza o maior valor no HTML e formata em reais
    document.getElementById('maior-valor').textContent = formatarDinheiro(maiorValor)

    // Atualiza o ano que será enviado para gerar o PDF
    document.getElementById('ano-pdf').value = ano

    // Verifica se existe algum ganho no ano selecionado
    if (maiorValor > 0) {
        // Mostra a mensagem informando qual mês teve o maior ganho
        document.getElementById('texto-melhor-mes').textContent = melhorMes + ' teve o maior ganho entre todos os meses de ' + ano + '.'
    } else {
        // Mostra uma mensagem caso não existam ganhos naquele ano
        document.getElementById('texto-melhor-mes').textContent = 'Nenhum ganho registrado em ' + ano + '.'
    }

    // Percorre todos os cards dos meses que estão no HTML
    document.querySelectorAll('.card-mes').forEach(function(card, i) {
        // Atualiza o valor de cada mês usando sua posição na lista
        card.querySelector('.valor-mes').textContent = formatarDinheiro(ganhos[i])

        // Adiciona a classe "destaque" somente ao mês com o maior ganho
        card.classList.toggle('destaque', maiorValor > 0 && i == posicaoMaior)
    })
}

// Executa a função sempre que o usuário selecionar outro ano
filtroAno.addEventListener('change', atualizarRelatorios)

// Executa a função ao abrir a página para mostrar os valores corretamente
atualizarRelatorios()