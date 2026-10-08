// Busca o campo de senha no HTML pelo seu ID
const senha = document.getElementById("senha");

// Adiciona um evento que é executado sempre que o usuário digita, apaga ou altera alguma coisa no campo de senha
senha.addEventListener("input", function() {

    // Cria variáveis para verificar se cada requisito da senha foi cumprido
    // Todas começam como false, pois ainda não sabemos se a senha atende aos requisitos
    let min_caractere = false;
    let min_upper = false;
    let min_lower = false;
    let min_num = false;
    let min_caractere_esp = false;

    // Verifica se a senha possui pelo menos 8 caracteres
    // O .length retorna a quantidade de caracteres digitados
    if (senha.value.length >= 8) {
        min_caractere = true;
    }

    // Aqui, é preciso percorrer caractere por caractere para conferir os requisitos
    for (let caractere of senha.value) {

        // Verifica se o caractere está entre A e Z, ou seja, se é uma letra maiúscula
        if (caractere >= "A" && caractere <= "Z") {
            min_upper = true;
        }

        // Verifica se o caractere está entre a e z, ou seja, se é uma letra minúscula
        if (caractere >= "a" && caractere <= "z") {
            min_lower = true;
        }

        // Verifica se o caractere está entre 0 e 9, ou seja, se é um número
        if (caractere >= "0" && caractere <= "9") {
            min_num = true;
        }

        // Verifica se o caractere não é uma letra maiúscula, uma letra minúscula nem um número.
        // Se não for nenhum desses, é considerado um caractere especial
        if (!(caractere >= "A" && caractere <= "Z") &&
             !(caractere >= "a" && caractere <= "z") &&
             !(caractere >= "0" && caractere <= "9")) {
             min_caractere_esp = true;
        }
    }

    // Se a senha tiver pelo menos 8 caracteres, adiciona a classe "cumprido" ao requisito correspondente no HTML
    // Caso contrário, remove a classe para indicar que o requisito não foi cumprido
    if (min_caractere == true) {
        document.getElementById("req-caracteres").classList.add("cumprido");
    } else {
        document.getElementById("req-caracteres").classList.remove("cumprido");
    }

    // Verifica se existe pelo menos uma letra maiúscula na senha
    // Adiciona ou remove a classe "cumprido" conforme o resultado
    if (min_upper == true) {
        document.getElementById("req-maiuscula").classList.add("cumprido");
    } else {
        document.getElementById("req-maiuscula").classList.remove("cumprido");
    }

    // Verifica se existe pelo menos uma letra minúscula na senha
    // Adiciona ou remove a classe "cumprido" conforme o resultado
    if (min_lower == true) {
        document.getElementById("req-minuscula").classList.add("cumprido");
    } else {
        document.getElementById("req-minuscula").classList.remove("cumprido");
    }

    // Verifica se existe pelo menos um número na senha
    // Adiciona ou remove a classe "cumprido" conforme o resultado
    if (min_num == true) {
        document.getElementById("req-numero").classList.add("cumprido");
    } else {
        document.getElementById("req-numero").classList.remove("cumprido");
    }

    // Verifica se existe pelo menos um caractere especial na senha
    // Adiciona ou remove a classe "cumprido" conforme o resultado
    if (min_caractere_esp == true) {
        document.getElementById("req-especial").classList.add("cumprido");
    } else {
        document.getElementById("req-especial").classList.remove("cumprido");
    }

})