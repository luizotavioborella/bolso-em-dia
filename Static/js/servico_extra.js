// Seleciona o campo de valor e aplica uma máscara monetária
// maskMoney é uma função do plugin jQuery MaskMoney
$("#valor").maskMoney({

    // Define o ponto como separador de milhares
    thousands: ".",

    // Define a vírgula como separador decimal
    decimal: ",",

    // Permite duas casas decimais
    precision: 2,

    // Não permite valores negativos
    allowNegative: false,

    // Não permite valor igual a zero
    allowZero: false
})

// Seleciona o formulário que contém o campo de valor
// Executa a função quando o usuário envia o formulário
$("#valor").closest("form").on("submit", function() {

    // Remove a máscara monetária e obtém o valor numérico
    var valor = $("#valor").maskMoney("unmasked")[0]

    // Converte o valor para duas casas decimais
    // Substitui o conteúdo do campo pelo número sem a máscara
    // Assim, o Flask recebe o valor no formato correto
    $("#valor").val(valor.toFixed(2))
})

// Seleciona o campo de descrição do serviço extra
const descricao = document.querySelector('textarea')

// Seleciona o elemento responsável pelo contador de caracteres
const contador = document.querySelector('.contador-descricao')

// Executa a função sempre que o usuário digita ou apaga algo na descrição
descricao.addEventListener('input', function() {

    // Conta a quantidade de caracteres digitados
    // Atualiza o texto exibido no contador
    contador.textContent = descricao.value.length + '/250'
})

// Seleciona o ícone do calendário
const iconeData = document.getElementById('icone-data-servico')

// Seleciona o campo de data do serviço extra
const dataServico = document.getElementById('data-servico')

// Executa a função quando o usuário clica no ícone do calendário
iconeData.addEventListener('click', function() {

    // Abre o seletor de datas do navegador
    dataServico.showPicker()
})