// $ é uma forma abreviada de chamar o jQuery.
// document representa o HTML da página.
// ready() espera o HTML carregar antes de executar o código.
// Seleciona os elementos com as classes e aplica as máscaras.
$(document).ready(function () {
    $('#telefone').mask('(00)00000-0000');
    $('#cpf').mask('000.000.000-00');
});