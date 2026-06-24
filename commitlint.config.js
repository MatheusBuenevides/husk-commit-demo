export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Tamanho máximo do título: 72 caracteres
    'header-max-length': [2, 'always', 72],

    // Tamanho mínimo do título: 10 caracteres
    'header-min-length': [2, 'always', 10],

    // Tipos de commit permitidos
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'chore', 'revert'],
    ],

    // Tipo obrigatório e em minúsculo
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],

    // Descrição não pode terminar com ponto
    'subject-full-stop': [2, 'never', '.'],

    // Descrição obrigatória
    'subject-empty': [2, 'never'],
  },
};

