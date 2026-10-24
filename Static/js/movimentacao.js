// Máscara para deixar o input do valor com 0,00
$("#valor").maskMoney({
    thousands: ".",
    decimal: ",",
    precision: 2,
    allowNegative: false,
    allowZero: false
})

$("#valor").closest("form").on("submit", function() {
    var valor = $("#valor").maskMoney("unmasked")[0]
    $("#valor").val(valor.toFixed(2))
})

// Seleciona os campos de tipo, categoria, descrição e contador
const tipo = document.getElementById('tipo')
const categoria = document.getElementById('categoria')
const descricao = document.querySelector('textarea')
const contador = document.querySelector('.contador-descricao')

// Filtra as categorias conforme o tipo selecionado
function filtrarCategorias() {
    const tipoSelecionado = tipo.value
    categoria.value = '' // Limpa a categoria selecionada

    // Percorre todas as opções de categoria
    for (let opcao of categoria.options) {
        const tipoCategoria = opcao.getAttribute('data-tipo')

        // Mantém visíveis as opções gerais ou do tipo selecionado
        if (!tipoCategoria) {
            opcao.hidden = false
        } else if (tipoCategoria == tipoSelecionado) {
            opcao.hidden = false
        } else {
            opcao.hidden = true
        }
    }
}

// Filtra as categorias quando o tipo é alterado
tipo.addEventListener('change', function() {
    filtrarCategorias()
})

// Redireciona para o cadastro de uma nova categoria quando selecionada
categoria.addEventListener('change', function() {
    if (categoria.value == 'nova') {
        window.location.href = categoria.dataset.urlNovaCategoria
    }
})

// Atualiza o contador conforme o usuário digita na descrição
descricao.addEventListener('input', function() {
    contador.textContent = descricao.value.length + '/250'
})

// Abre o calendário ao clicar no ícone
document.getElementById('icone-data').addEventListener('click', function() {
    document.getElementById('data-movimentacao').showPicker()
})