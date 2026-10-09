 // criamos uma função para mostrar a foto assim que ela for selecionada.
 // o parâmetro input representa o campo utilizado para escolher a imagem.
 function mostrarFoto(input) {

    // pegamos o primeiro arquivo selecionado pelo usuário.
     // utilizamos [0] porque o input permite selecionar apenas um arquivo.
     let arquivo = input.files[0];

     // verificamos se o usuário realmente selecionou algum arquivo.
     if (arquivo) {

        // localizamos a imagem de perfil através do seu ID.
        let imagem = document.getElementById('imagem-perfil');

        // criamos um endereço temporário para mostrar a foto escolhida.
        // isso permite atualizar a imagem na tela sem precisar salvá-la antes.
        imagem.src = URL.createObjectURL(arquivo);
     }
}