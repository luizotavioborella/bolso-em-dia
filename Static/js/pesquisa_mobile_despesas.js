// Seleciona o botão que abre a pesquisa na versão mobile
var botaoPesquisaDespesa = document.querySelector("#botao-pesquisa-despesa")

// Seleciona a seção que contém a tabela de despesas
var minhasDespesas = document.querySelector(".minhas-despesas")

// Seleciona o campo onde o usuário digita a descrição da despesa
var buscarDespesa = document.querySelector("#buscar-despesa")

// Executa esta função quando o botão de pesquisa é clicado
botaoPesquisaDespesa.addEventListener("click", function () {

    // Verifica se a pesquisa já está aberta
    if (minhasDespesas.classList.contains("busca-aberta")) {

        // Se estiver aberta, remove a classe e fecha a pesquisa
        minhasDespesas.classList.remove("busca-aberta")

    } else {

        // Se estiver fechada, adiciona a classe e abre a pesquisa
        minhasDespesas.classList.add("busca-aberta")

        // Coloca o cursor automaticamente no campo de pesquisa
        buscarDespesa.focus()
    }
})