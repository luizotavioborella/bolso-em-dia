// Seleciona os campos de tipo, categoria, descrição e contador
const tipo = document.getElementById('tipo')
const categoria = document.getElementById('categoria')
const descricao = document.querySelector('textarea')
const contador = document.querySelector('.contador-descricao')

// Filtra as categorias conforme o tipo selecionado
function filtrarCategorias(limparSelecao = true) {
    const categoriaAnterior = categoria.value
    const tipoSelecionado = tipo.value

    // Limpa a categoria atual quando o tipo é alterado
    if (limparSelecao) {
        categoria.value = ''
    }

    // Exibe apenas categorias compatíveis com o tipo selecionado
    for (let opcao of categoria.options) {
        if (opcao.value === '') {
            opcao.hidden = false
        } else if (opcao.value === 'nova') {
            opcao.hidden = false
        } else {
            const tipoCategoria = opcao.getAttribute('data-tipo')

            if (tipoSelecionado !== '' && tipoCategoria === tipoSelecionado) {
                opcao.hidden = false
            } else {
                opcao.hidden = true
            }
        }
    }

    // Mantém a categoria original ao carregar a página
    if (!limparSelecao) {
        categoria.value = categoriaAnterior
    }
}

// Filtra as categorias quando o tipo é alterado
tipo.addEventListener('change', function() {
    filtrarCategorias()
})

// Filtra as categorias ao abrir a página, sem limpar a seleção atual
filtrarCategorias(false)

// Redireciona para a página de cadastro de categoria
categoria.addEventListener('change', function() {
    if (categoria.value === 'nova') {
        window.location.href = categoria.dataset.urlNovaCategoria
    }
})

// Impede o envio do formulário se "Adicionar Categoria" estiver selecionado
document.querySelector('form').addEventListener('submit', function(event) {
    if (categoria.value === 'nova') {
        event.preventDefault()
        window.location.href = categoria.dataset.urlNovaCategoria
    }
})

// Atualiza o contador enquanto a descrição é digitada
descricao.addEventListener('input', function() {
    contador.textContent = descricao.value.length + '/250'
})

// Exibe a quantidade de caracteres já existentes ao abrir a página
contador.textContent = descricao.value.length + '/250'