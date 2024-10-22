const less = require("grunt-contrib-less");
const sass = require("grunt-contrib-sass");
const replace = require("grunt-replace");
const clean = require("grunt-contrib-clean");

module.exports = function (grunt) {
  // Configuração do Grunt
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),

    // Configurações para compilar arquivos LESS
    less: {
      development: {
        files: {
          "dev/styles/main.css": "src/styles/main.less", // Destino : Origem
        },
      },
      production: {
        options: {
          compress: true, // Habilita a compressão do CSS para produção
        },
        files: {
          "dist/styles/main.min.css": "src/styles/main.less", // Gera um arquivo minificado
        },
      },
    },

    // Configurações para observar mudanças nos arquivos
    watch: {
      styles: {
        files: ["src/styles/**/*.less"], // Observa todos os arquivos .less
        tasks: ["less:development", "replace:dev"], // Executa tarefas de LESS e replace ao detectar mudanças
        options: {
          spawn: false,
        },
      },
      html: {
        files: ["src/index.html"], // Observa o arquivo HTML
        tasks: ["replace:dev"], // Executa a tarefa de replace ao detectar mudanças
        options: {
          spawn: false,
        },
      },
    },

    // Configurações para substituir texto no HTML
    replace: {
      dev: {
        options: {
          patterns: [
            {
              match: "ENDERECO_DO_CSS", // Texto a ser substituído
              replacement: "./styles/main.css", // Novo valor
            },
            {
              match: "ENDERECO_DO_JS", // Texto a ser substituído
              replacement: "../src/scripts/main.js", // Novo valor
            },
          ],
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ["src/index.html"], // Arquivo a ser modificado
            dest: "dev/", // Destino do arquivo modificado
          },
        ],
      },

      dist: {
        options: {
          patterns: [
            {
              match: "ENDERECO_DO_CSS", // Texto a ser substituído
              replacement: "./styles/main.min.css", // Novo valor
            },
            {
              match: "ENDERECO_DO_JS", // Texto a ser substituído
              replacement: "./scripts/main.min.js", // Novo valor
            },
          ],
        },
        files: [
          {
            expand: true,
            flatten: true,
            src: ["prebuild/index.html"], // Arquivo a ser modificado
            dest: "dist/", // Destino do arquivo modificado
          },
        ],
      },
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
        },
        files: {
          "prebuild/index.html": "src/index.html",
        },
      },
    },

    // Configuração do Clean
    clean: {
      build: ["prebuild"], // Limpa o diretório prebuild antes da construção
    },

    // Configuração do Uglify
    uglify: {
      target: {
        files: {
          "dist/scripts/main.min.js": ["src/scripts/main.js"],
        },
      },
    },

    // Configuração para executar tarefas em paralelo
    concurrent: {
      dev: {
        tasks: ["less:development", "replace:dev", "watch"], // Compila LESS, substitui e observa mudanças
        options: {
          logConcurrentOutput: true, // Para ver o output de ambas as tarefas
        },
      },
      build: {
        tasks: [
          "less:production",
          "htmlmin:dist",
          "replace:dist",
          "clean",
          "uglify",
        ], // Para produção
        options: {
          logConcurrentOutput: true,
        },
      },
    },
  });

  // Carregamento dos plugins
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-concurrent");
  grunt.loadNpmTasks("grunt-replace");
  grunt.loadNpmTasks("grunt-contrib-htmlmin");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");

  // Tarefa padrão a ser executada
  grunt.registerTask("default", ["concurrent:dev"]); // Para desenvolvimento

  // Tarefa de produção para gerar arquivos minificados
  grunt.registerTask("build", ["concurrent:build"]); // Agora usando concurrent para a tarefa de build
};
