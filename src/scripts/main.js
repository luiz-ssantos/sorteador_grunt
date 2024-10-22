document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("form-sorteador")
    .addEventListener("submit", function (evento) {
      evento.preventDefault();
      let numeroMaximo = document.getElementById("numeroMaximo").value;
      numeroMaximo = parseInt(numeroMaximo);

      let numeroAleatorio = Math.random() * (numeroMaximo + 1);
      numeroAleatorio = parseInt(numeroAleatorio);

      if (numeroAleatorio == 0) {
        numeroAleatorio = numeroAleatorio + 1;
      }

      document.getElementById("resultadoValor").innerText = numeroAleatorio;
      document.querySelector(".resultado").style.display = "block";
    });
});
