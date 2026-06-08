var paletas = [
  ["#ff6b9d","#ff9f43","#ffd32a","#0be881","#0fbcf9","#d980fa"],
  ["#e05260","#e07b30","#d4ac20","#3aaa66","#3a8fc9","#8e5bbf"],
  ["#f8b500","#e84393","#0091ea","#00c853","#ff6d00","#7c4dff"],
  ["#00b4d8","#5e60ce","#4cc9f0","#f72585","#7209b7","#3a0ca3"],
  ["#06d6a0","#ffd166","#ef476f","#118ab2","#b5179e","#f77f00"]
];

var cores = paletas[0];
var efeito = "saltitar";
var animFrame = null;
var t = 0;

function hslCor(h) {
  var s = 1, l = 0.6;
  var a = s * Math.min(l, 1 - l);
  function canal(n) {
    var k = (n + h / 30) % 12;
    var val = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(val * 255).toString(16).padStart(2, "0");
  }
  return "#" + canal(0) + canal(8) + canal(4);
}

function renderizar() {
  var nome = document.getElementById("nome").value;
  var res = document.getElementById("resultado");

  if (animFrame !== null) {
    cancelAnimationFrame(animFrame);
    animFrame = null;
  }

  res.innerHTML = "";
  if (nome.length === 0) return;

  for (var i = 0; i < nome.length; i++) {
    var sp = document.createElement("span");
    sp.className = "letra";
    if (nome[i] === " ") {
      sp.innerHTML = "&nbsp;";
    } else {
      sp.textContent = nome[i];
    }
    var cor = efeito === "arcoiris"
      ? hslCor((i / nome.length) * 360)
      : cores[i % cores.length];
    sp.style.color = cor;
    res.appendChild(sp);
  }

  iniciarAnimacao();
}

function iniciarAnimacao() {
  var letras = document.getElementById("resultado").getElementsByClassName("letra");
  if (letras.length === 0) return;

  if (efeito === "nenhum") {
    for (var i = 0; i < letras.length; i++) {
      letras[i].style.transform = "none";
      letras[i].style.opacity = "1";
    }
    return;
  }

  function loop() {
    t += 0.05;
    var arr = document.getElementById("resultado").getElementsByClassName("letra");
    for (var i = 0; i < arr.length; i++) {
      var p = t + i * 0.65;
      if (efeito === "saltitar") {
        arr[i].style.transform = "translateY(" + (Math.sin(p) * 10).toFixed(2) + "px)";
        arr[i].style.opacity = "1";
      } else if (efeito === "onda") {
        var sc = 1 + Math.sin(p) * 0.2;
        arr[i].style.transform = "scale(" + sc.toFixed(3) + ")";
        arr[i].style.opacity = "1";
      } else if (efeito === "pulsar") {
        arr[i].style.opacity = (0.35 + Math.abs(Math.sin(p)) * 0.65).toFixed(2);
        arr[i].style.transform = "none";
      } else if (efeito === "shake") {
        arr[i].style.transform = "translateX(" + (Math.sin(p * 2.5) * 5).toFixed(2) + "px) rotate(" + (Math.sin(p * 2.5) * 7).toFixed(2) + "deg)";
        arr[i].style.opacity = "1";
      } else if (efeito === "arcoiris") {
        var h = ((i / arr.length) * 360 + t * 60) % 360;
        arr[i].style.color = hslCor(h);
        arr[i].style.transform = "none";
        arr[i].style.opacity = "1";
      }
    }
    animFrame = requestAnimationFrame(loop);
  }

  loop();
}

document.getElementById("nome").addEventListener("input", renderizar);

document.getElementById("btnCores").addEventListener("click", function() {
  var idx = Math.floor(Math.random() * paletas.length);
  cores = paletas[idx];
  renderizar();
});

var botoesEfeito = [
  { id: "ef-saltitar", ef: "saltitar" },
  { id: "ef-onda",     ef: "onda"     },
  { id: "ef-pulsar",   ef: "pulsar"   },
  { id: "ef-shake",    ef: "shake"    },
  { id: "ef-arcoiris", ef: "arcoiris" },
  { id: "ef-nenhum",   ef: "nenhum"   }
];

function clicarEfeito(efNome) {
  efeito = efNome;
  for (var k = 0; k < botoesEfeito.length; k++) {
    var b = document.getElementById(botoesEfeito[k].id);
    b.className = botoesEfeito[k].ef === efNome ? "btn-ef ativo" : "btn-ef";
  }
  if (animFrame !== null) {
    cancelAnimationFrame(animFrame);
    animFrame = null;
  }
  iniciarAnimacao();
}

for (var j = 0; j < botoesEfeito.length; j++) {
  (function(efNome) {
    document.getElementById("ef-" + efNome).addEventListener("click", function() {
      clicarEfeito(efNome);
    });
  })(botoesEfeito[j].ef);
}

document.getElementById("nome").value = "Ola!";
renderizar();
