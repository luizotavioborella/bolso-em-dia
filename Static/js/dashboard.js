 // Seleciona o canvas onde o gráfico de ganhos mensais será exibido
const ctx = document.getElementById('myChart')

// Seleciona o campo responsável pela escolha do ano
const filtroAno = document.getElementById('filtro-ano')

// Recebe do Flask os ganhos mensais separados por ano
// O tojson transforma os dados Python em dados que o JavaScript consegue utilizar
const ganhosPorAno = JSON.parse(document.getElementById('ganhos-por-ano').textContent)

// Recebe do Flask os indicadores financeiros de cada ano
const dadosPorAno = JSON.parse(document.getElementById('dados-por-ano').textContent)

// Recebe o ano atual enviado pelo Flask
const anoAtual = filtroAno.value

// Armazena os caminhos das imagens utilizadas nas comparações
const setaVerde = filtroAno.dataset.setaVerde
const setaVermelha = filtroAno.dataset.setaVermelha

// Cria o gráfico utilizando a biblioteca Chart.js
const grafico = new Chart(ctx, {

    // Define que o gráfico será do tipo barras
    type: 'bar',

    // Configura os dados que serão apresentados no gráfico
    data: {

        // Define os nomes dos meses
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],

        // Define os valores e a aparência das barras
        datasets: [{

            // Carrega os ganhos mensais do ano atual
            data: ganhosPorAno[anoAtual],

            // Define a cor verde das barras
            backgroundColor: '#14A83B',

            // Remove as bordas das barras
            borderWidth: 0,

            // Define a espessura das barras
            barThickness: 17
        }]
    },

    // Configura a aparência e o comportamento do gráfico
    options: {

        // Exibe as barras na horizontal
        indexAxis: 'y',

        // Faz o gráfico se adaptar ao tamanho da tela
        responsive: true,

        // Permite que o gráfico utilize o espaço disponível sem manter uma proporção fixa
        maintainAspectRatio: false,

        // Configura os elementos adicionais do gráfico
        plugins: {

            // Oculta a legenda do gráfico
            legend: {
                display: false
            },

            // Personaliza as informações exibidas ao passar o mouse sobre uma barra
            tooltip: {
                callbacks: {
                    label: function(context) {

                        // Mostra o valor da barra em reais com duas casas decimais
                        return 'R$ ' + context.raw.toFixed(2).replace('.', ',')                         }
                }
            }
        },

        // Configura os eixos do gráfico
        scales: {

            // Configura o eixo horizontal, responsável pelos valores
            x: {

                // Faz os valores começarem em zero
                beginAtZero: true,

                // Personaliza os valores apresentados no eixo
                ticks: {
                    callback: function(valor) {

                        // Adiciona R$ antes de cada valor
                        return 'R$ ' + valor
                    }
                }
            },

            // Configura o eixo vertical, responsável pelos meses
            y: {
                grid: {

                    // Oculta as linhas de grade do eixo vertical
                    display: false
                }
            }
        }
    }
})

// Função responsável por formatar os valores em dinheiro
function formatarDinheiro(valor) {

    // Converte o valor para número e mantém duas casas decimais
    // Depois adiciona R$ antes do resultado
    return 'R$ ' + Number(valor).toFixed(2).replace('.', ',')
}

// Função responsável por atualizar as setas e porcentagens dos indicadores
// Recebe os IDs dos elementos, a informação de aumento ou queda,
// a porcentagem e se o indicador representa uma despesa
function atualizarComparacao(setaId, percentualId, subiu, percentual, despesa) {

    // Seleciona a imagem da seta que será atualizada
    const seta = document.getElementById(setaId)

    // Seleciona o elemento que mostra a porcentagem
    const porcentagem = document.getElementById(percentualId)

    // Atualiza o texto com a porcentagem calculada pelo Flask
    porcentagem.textContent = percentual + '%'

    // Verifica se o indicador é uma despesa
    // Nas despesas, o aumento é negativo e a redução é positiva
    if (despesa) {

        // Se as despesas aumentaram, utiliza a seta vermelha
        if (subiu) {
            seta.src = setaVermelha
            seta.classList.remove('seta-baixo')
            porcentagem.className = 'porcentagem-vermelha'

        // Se as despesas diminuíram, utiliza a seta verde
        } else {
            seta.src = setaVerde
            seta.classList.add('seta-baixo')
            porcentagem.className = 'porcentagem-verde'
        }

    // Para os demais indicadores, o aumento é positivo
    } else {

        // Se o valor aumentou, utiliza a seta verde
        if (subiu) {
            seta.src = setaVerde
            seta.classList.remove('seta-baixo')
            porcentagem.className = 'porcentagem-verde'

        // Se o valor diminuiu, utiliza a seta vermelha
        } else {
            seta.src = setaVermelha
            seta.classList.add('seta-baixo')
            porcentagem.className = 'porcentagem-vermelha'
        }
    }
}

// Detecta quando o usuário seleciona outro ano no filtro
filtroAno.addEventListener('change', function() {

    // Obtém o ano selecionado pelo usuário
    const anoSelecionado = filtroAno.value

    // Atualiza o ano usado para gerar o PDF de previsões
    document.getElementById('ano-pdf-dashboard').value = anoSelecionado

    // Busca os indicadores financeiros correspondentes ao ano escolhido
    const dados = dadosPorAno[anoSelecionado]

    // Substitui os valores do gráfico pelos ganhos mensais do ano selecionado
    grafico.data.datasets[0].data = ganhosPorAno[anoSelecionado]

    // Atualiza o gráfico para mostrar os novos valores
    grafico.update()

    // Atualiza o valor total de ganhos do ano
    document.getElementById('ganho-ano').textContent = formatarDinheiro(dados.ganho_ano)

    // Atualiza o valor total de despesas do ano
    document.getElementById('despesas-ano').textContent = formatarDinheiro(dados.despesas_ano)

    // Seleciona o elemento responsável pelo saldo atual
    const saldo = document.getElementById('saldo-atual')

    // Atualiza o saldo com o valor correspondente ao ano selecionado
    saldo.textContent = formatarDinheiro(dados.saldo_atual)

    // Verifica se o saldo é negativo
    if (dados.saldo_negativo) {

        // Se o saldo for negativo, utiliza a cor vermelha
        saldo.className = 'valor-card valor-vermelho'

    } else {

        // Se o saldo não for negativo, utiliza a cor verde
        saldo.className = 'valor-card valor-verde'
    }

    // Atualiza a quantidade de dias trabalhados no ano
    document.getElementById('dias-trabalhados').textContent = dados.dias_trabalhados_ano

    // Atualiza a quantidade de pacotes coletados no ano
    document.getElementById('pacotes-coletados').textContent = dados.pacotes_ano

    // Atualiza a média de ganho por dia
    document.getElementById('media-ganho').textContent = formatarDinheiro(dados.media_ganho_dia)

    // Atualiza o saldo projetado mensal
    document.getElementById('saldo-projetado-mensal').textContent = formatarDinheiro(dados.saldo_projetado_mensal)

    // Atualiza o saldo projetado anual
    document.getElementById('saldo-projetado-anual').textContent = formatarDinheiro(dados.saldo_projetado_anual)

    // Atualiza a seta e a porcentagem dos ganhos
    atualizarComparacao('ganho-seta', 'ganho-percentual', dados.ganho_subiu, dados.ganho_percentual, false)

    // Atualiza a seta e a porcentagem das despesas
    // O true indica que esse indicador representa uma despesa
    atualizarComparacao('despesas-seta', 'despesas-percentual', dados.despesas_subiram, dados.despesas_percentual, true)

    // Atualiza a seta e a porcentagem do saldo atual
    atualizarComparacao('saldo-seta', 'saldo-percentual', dados.saldo_subiu, dados.saldo_percentual, false)

    // Atualiza a seta e a porcentagem dos dias trabalhados
    atualizarComparacao('dias-seta', 'dias-percentual', dados.dias_subiram, dados.dias_percentual, false)

    // Atualiza a seta e a porcentagem dos pacotes coletados
    atualizarComparacao('pacotes-seta', 'pacotes-percentual', dados.pacotes_subiram, dados.pacotes_percentual, false)

    // Atualiza a seta e a porcentagem da média de ganho por dia
    atualizarComparacao('media-seta', 'media-percentual', dados.media_subiu, dados.media_percentual, false)

    // Atualiza a seta e a porcentagem da projeção mensal
    atualizarComparacao('projecao-mensal-seta', 'projecao-mensal-percentual', dados.projecao_subiu, dados.projecao_percentual, false)

    // Atualiza a seta e a porcentagem da projeção anual
    atualizarComparacao('projecao-anual-seta', 'projecao-anual-percentual', dados.projecao_subiu, dados.projecao_percentual, false)
})