// Seleciona o campo de pacotes coletados
const pacotesColetados = document.getElementById('pacotes-coletados')

// Seleciona o elemento que exibirá o valor total
const valorTotal = document.getElementById('valor-total')

// Obtém os valores configurados no perfil do usuário
const valorDiaria = Number(pacotesColetados.dataset.valorDiaria)
const adicional = Number(pacotesColetados.dataset.adicional)
const minPacotes = Number(pacotesColetados.dataset.minPacotes)

// Calcula o valor que será recebido conforme a quantidade de pacotes
function atualizarValorTotal() {

    // Obtém a quantidade digitada pelo usuário
    const pacotes = Number(pacotesColetados.value)

    // Inicializa o valor total
    let total = 0

    // Só calcula quando existe uma quantidade válida de pacotes
    if (pacotes > 0) {

        // O usuário recebe o valor da diária
        total = valorDiaria

        // Verifica se ultrapassou a quantidade mínima de pacotes
        if (pacotes > minPacotes) {

            // Calcula a quantidade de pacotes excedentes
            const pacotesExcedentes = pacotes - minPacotes

            // Soma o adicional dos pacotes excedentes ao valor da diária
            total = total + (pacotesExcedentes * adicional)
        }
    }

    // Exibe o valor total no formato monetário brasileiro
    valorTotal.textContent = total.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })
}

// Atualiza o valor automaticamente enquanto o usuário digita
pacotesColetados.addEventListener('input', function() {
    atualizarValorTotal()
})

// Seleciona o ícone do calendário
const iconeDataDia = document.getElementById('icone-data-dia')

// Seleciona o campo de data
const dataDia = document.getElementById('data-dia')

// Abre o calendário ao clicar no ícone
iconeDataDia.addEventListener('click', function() {
    dataDia.showPicker()
})