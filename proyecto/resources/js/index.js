/* Muestra en consola Hola Mundo! creando una clase llamada App*/
class App {
  static acomulador = 0;
  static file;
  static fileCompiled;
  static ram = new Array(8100);
  static reservedWords = [
    "//",
    "cargue",
    "almacene",
    "nueva",
    "lea",
    "sume",
    "reste",
    "multiplique",
    "divida",
    "potencia",
    "modulo",
    "concatene",
    "elimine",
    "extraiga",
    "Y",
    "O",
    "NO",
    "muestre",
    "imprima",
    "vaya",
    "vayasi",
    "etiqueta",
    "retorne",
  ];

  constructor() {}

  static main() {
    App.operativeSystem();
    App.updateRam();
    document.getElementById("submit").addEventListener("change", function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (e) {
        App.file = e.target.result;
      };
      reader.readAsText(file);
      setTimeout(() => {
        App.syntaxCheck();
      }, 100);
    });

    document.getElementById("runCode").addEventListener("click", function () {
      if (document.getElementById("errors").innerHTML == "") {
        var variables = App.appendToRam();
        setTimeout(() => {
          App.runCode(variables);
        }, 100);
      } else {
        alert("El archivo tiene errores");
      }
    });
  }

  // Inicializa la memoria RAM con el sistema operativo
  static operativeSystem() {
    for (var i = 0; i < 130; i++) {
      App.ram[i] = "sistema";
    }
  }

  // Actualiza la memoria RAM
  static updateRam() {
    let ramUpdate = document.querySelector("#ramUpdate");
    if (ramUpdate == undefined) {
      ramUpdate = document.createElement("div");
      ramUpdate.id = "ramUpdate";
      document.body.appendChild(ramUpdate); // Agrega el div al body
    }
    // Limpia el contenido del div
    ramUpdate.innerHTML = "";
    for (var i = 0; i < App.ram.length; i++) {
      let h3 = document.createElement("h3");
      if (App.ram[i] == undefined) {
        h3.textContent = `${i}: undefined`;
      } else {
        h3.textContent = `${i}: ` + App.ram[i];
      }
      ramUpdate.appendChild(h3);
    }
  }

  // Imprime el contenido del archivo seleccionado
  static printFile() {
    var numberOfLines = 0;
    var codeDiv = document.getElementById("code");
    // Clear the content of the "code" div
    codeDiv.innerHTML = "";
    App.file.split("\n").forEach(function (line) {
      var h3 = document.createElement("h3");
      h3.textContent = `${numberOfLines}` + `: ` + line;
      codeDiv.appendChild(h3);
      numberOfLines++;
    });
  }

  // Verifica que el archivo tenga la sintaxis correcta
  static syntaxCheck() {
    App.file = App.file.replace(/^\s*\n/gm, "\n");
    App.printFile();
    var isGood = true; // Variable que indica si el archivo tiene errores
    var numberLine = 0;
    var errorDiv = document.getElementById("errors");
    errorDiv.innerHTML = "";
    App.file.split("\n").forEach(function (line) {
      var words = line.split(" ");
      if (!App.reservedWords.includes(words[0])) {
        var error = document.createElement("h3");
        error.textContent =
          "Syntax error: " + words[0] + " in line " + numberLine;
        errorDiv.appendChild(error);
        isGood = false;
      }
      numberLine++;
    });
    console.log(isGood);
    return isGood;
  }

  // Agrega el contenido del archivo a la memoria RAM
  static appendToRam() {
    var i = 130;
    var commentsDeleted = 0;
    App.fileCompiled = App.file;

    while (App.ram[i] != undefined) {
      i++;
    }

    App.file.split("\n").forEach(function (line) {
      var words = line.split(" ");
      if (App.ram[i] == undefined) {
        if (!line.includes("//")) {
          App.ram[i] = line;
          i++;
        } else {
          App.file = App.file.replace(line, "");
          App.fileCompiled = App.fileCompiled.replace(line, "");
          commentsDeleted++;
        }
      }
    });

    App.file.split("\n").forEach(function (line) {
      var words = line.split(" ");
      if (words[0] == "nueva") {
        if (words[3] != undefined) {
          App.fileCompiled = App.fileCompiled.replaceAll(
            " " + words[1],
            " " + i
          );
          if (words[2] == "C") {
            App.ram[i] = toString(words[3]);
            i++;
          }
          if (words[2] == "I") {
            App.ram[i] = parseInt(words[3]);
            i++;
          }
          if (words[2] == "R") {
            App.ram[i] = parseFloat(words[3]);
            i++;
          }
          if (words[2] == "L") {
            App.ram[i] = words[3] == "1" ? true : false;
            i++;
          }
        } else {
          App.ram[i] = 0;
          i++;
        }
      }
      if (words[0] == "etiqueta") {
        App.ram[i] = parseInt(words[2]) - commentsDeleted;
        App.fileCompiled = App.fileCompiled.replaceAll(" " + words[1], " " + i);
        i++;
      }
    });
    App.updateRam();
  }

  // Ejecuta el código
  static runCode() {
    App.file = App.file.replace(/^\s*\n/gm, "\n");
    App.fileCompiled = App.fileCompiled.replace(/^\s*\n/gm, "\n");
    var visualCode = App.file.split("\n");
    var compiledCode = App.fileCompiled.split("\n");
    var words;
    var wordsCompiled;

    for (var i = 1; i < visualCode.length; i++) {
      words = visualCode[i].split(" ");
      wordsCompiled = compiledCode[i].split(" ");
      App.updateCodeLine(visualCode[i]);

      if (words[0] == "cargue") {
        App.acomulador = App.ram[parseInt(wordsCompiled[1])];
        App.updateAcomulador();
      }
      if (words[0] == "almacene") {
        App.ram[parseInt(wordsCompiled[1])] = App.acomulador;
        App.updateRam();
      }
      if (words[0] == "lea") {
        App.ram[parseInt(wordsCompiled[1])] = prompt("Ingrese un valor");
        App.updateAcomulador();
      }
      if (words[0] == "sume") {
        App.acomulador =
          parseInt(App.acomulador) +
          parseInt(App.ram[parseInt(wordsCompiled[1])]);
        App.updateAcomulador();
      }
      if (words[0] == "reste") {
        App.acomulador =
          parseInt(App.acomulador) -
          parseInt(App.ram[parseInt(wordsCompiled[1])]);
        App.updateAcomulador();
      }
      if (words[0] == "multiplique") {
        App.acomulador =
          parseInt(App.acomulador) *
          parseInt(App.ram[parseInt(wordsCompiled[1])]);
        App.updateAcomulador();
      }
      if (words[0] == "divida") {
        App.acomulador =
          parseInt(App.acomulador) /
          parseInt(App.ram[parseInt(wordsCompiled[1])]);
        App.updateAcomulador();
      }
      if (words[0] == "potencia") {
        App.acomulador = Math.pow(
          parseInt(App.acomulador),
          parseInt(App.ram[parseInt(wordsCompiled[1])])
        );
        App.updateAcomulador();
      }
      if (words[0] == "modulo") {
        App.acomulador =
          parseInt(App.acomulador) %
          parseInt(App.ram[parseInt(wordsCompiled[1])]);
        App.updateAcomulador();
      }
      if (words[0] == "concatene") {
        App.acomulador += App.ram[parseInt(wordsCompiled[1])];
        App.updateAcomulador();
      }
      if (words[0] == "elimine") {
        App.acomulador = App.acomulador.replaceAll(
          App.ram[parseInt(wordsCompiled[1])],
          ""
        );
        App.updateAcomulador();
      }
      if (words[0] == "extraiga") {
        App.acomulador = App.acomulador.substring(
          0,
          App.ram[parseInt(wordsCompiled[1])]
        );
        App.updateAcomulador();
      }
      if (words[0] == "Y") {
        App.acomulador = App.acomulador && App.ram[parseInt(wordsCompiled[1])];
        App.updateAcomulador();
      }
      if (words[0] == "O") {
        App.acomulador = App.acomulador || App.ram[parseInt(wordsCompiled[1])];
        App.updateAcomulador();
      }
      if (words[0] == "NO") {
        App.acomulador = !App.ram[parseInt(wordsCompiled[1])];
        App.updateAcomulador();
      }
      if (words[0] == "muestre") {
        App.show(App.ram[parseInt(wordsCompiled[1])]);
      }
      if (words[0] == "imprima") {
        App.print(App.ram[parseInt(wordsCompiled[1])]);
      }
      if (words[0] == "vaya") {
        i = App.ram[parseInt(wordsCompiled[1])];
      }
      if (words[0] == "vayasi") {
        if (App.acomulador > 0) {
          i = App.ram[parseInt(wordsCompiled[1])];
        }
        if (App.acomulador < 0) {
          i = App.ram[parseInt(wordsCompiled[2])];
        }
        if (App.acomulador == 0) {
        }
      }
    }
    App.updateRam();
  }

  // Muestra el valor en el div "output"
  static show(value) {
    var outputDiv = document.getElementById("output");
    var newElement = document.createElement("h3");
    newElement.textContent = value;
    outputDiv.appendChild(newElement);
  }

  // Imprime el valor en el div "print"
  static print(value) {
    var printDiv = document.getElementById("print");
    var newElement = document.createElement("h3");
    newElement.textContent = value;
    printDiv.appendChild(newElement);
  }

  // Actualiza el valor del acumulador en el div "acomulador"
  static updateAcomulador() {
    var acomuladorDiv = document.getElementById("acomulador");
    acomuladorDiv.innerHTML = "";
    acomuladorDiv.textContent = App.acomulador;
  }

  // Actualiza el valor de la línea de código en el div "codeLine"
  static updateCodeLine(line) {
    var codeLineDiv = document.getElementById("codeLine");
    codeLineDiv.innerHTML = "";
    codeLineDiv.textContent = line;
  }
}

App.main();
