// busca os campos de filtros
var filtroStatus = document.querySelector("#filtro-status")
var filtroTipo = document.querySelector("#filtro-tipo")
var buscarCategoria = document.querySelector("#buscar-categoria")

// aplica os filtros selecionados pelo usuário nas categorias
function filtrarCategorias() {

    // pega os valores dos filtros e o texto pesquisado
    var valorStatus = filtroStatus.value
    var valorTipo = filtroTipo.value
    var valorBusca = buscarCategoria.value.toLowerCase()

    // busca todas as categorias exibidas na página
    var itens = document.querySelectorAll(".item-categoria")

    // percorre cada categoria para verificar se ela atende aos filtros
    itens.forEach(function (item) {

        // pega o status, o tipo e o nome da categoria atual
        var statusCategoria = item.dataset.status
        var tipoCategoria = item.dataset.tipo
        var nomeCategoria = item.dataset.nome.toLowerCase()

        // verifica se a categoria corresponde ao status e ao tipo selecionados
        var mostrarStatus = valorStatus == "todos" || statusCategoria == valorStatus
        var mostrarTipo = valorTipo == "todos" || tipoCategoria == valorTipo

        // verifica se o nome da categoria contém o texto pesquisado
        var mostrarNome = nomeCategoria.includes(valorBusca)

        // exibe a categoria se ela atender a todos os filtros, caso contrário oculta
        if (mostrarStatus && mostrarTipo && mostrarNome) {
            item.style.display = "flex"
        } else {
            item.style.display = "none"
        }
    })
}

// atualiza os resultados quando o status ou o tipo selecionado mudar
filtroStatus.addEventListener("change", function () {
    filtrarCategorias()
})

filtroTipo.addEventListener("change", function () {
    filtrarCategorias()
})

// atualiza os resultados enquanto o usuário digita na busca
buscarCategoria.addEventListener("input", function () {
    filtrarCategorias()
})
