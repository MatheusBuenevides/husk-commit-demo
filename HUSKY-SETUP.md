# Guia de Configuração: Husky + Commitizen + Commitlint + Lint-staged

Guia completo para padronizar commits em projetos Angular com validação automática de mensagens e formatação de código.

---

## O que será instalado

| Ferramenta | Função |
|------------|--------|
| **Husky** | Ativa git hooks no projeto |
| **Commitizen** | Menu interativo para construir commits |
| **Commitlint** | Valida se a mensagem segue o padrão |
| **Lint-staged** | Formata apenas os arquivos em stage |
| **Prettier** | Formatador de código |

---

## Pré-requisitos

- Node.js instalado
- Projeto Angular existente
- Repositório git inicializado (`git init`)

---

## Passo 1 — Instalar as dependências

```bash
npm install --save-dev husky lint-staged prettier commitizen cz-conventional-changelog @commitlint/config-conventional @commitlint/cli
```

---

## Passo 2 — Inicializar o Husky

```bash
npx husky init
```

Esse comando cria a pasta `.husky/` com um arquivo `pre-commit` de exemplo e adiciona o script `prepare` no `package.json` automaticamente.

---

## Passo 3 — Configurar o hook `pre-commit`

Abra o arquivo `.husky/pre-commit` e substitua o conteúdo por:

```sh
npx lint-staged
```

Esse hook roda o lint-staged antes de cada commit, formatando apenas os arquivos que estão em stage.

---

## Passo 4 — Criar o hook `commit-msg`

Crie o arquivo `.husky/commit-msg` com o seguinte conteúdo:

```sh
npx --no -- commitlint --edit "$1"
```

Esse hook valida se a mensagem do commit segue o padrão Conventional Commits.

---

## Passo 5 — Criar o arquivo de configuração do Commitlint

Crie o arquivo `commitlint.config.js` na raiz do projeto com as regras do time:

```js
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
```

### Como funciona cada regra

Cada regra segue o formato `[severidade, condição, valor]`.

**Severidade:**

| Valor | Significado |
|-------|-------------|
| `0` | Desativada |
| `1` | Warning — avisa mas não bloqueia o commit |
| `2` | Error — bloqueia o commit |

**Condição:**

| Valor | Significado |
|-------|-------------|
| `'always'` | A regra sempre deve ser respeitada |
| `'never'` | A situação descrita nunca deve ocorrer |

### Outras regras disponíveis

```js
// Escopo em minúsculo
'scope-case': [2, 'always', 'lower-case'],

// Corpo do commit: linha máxima de 100 caracteres
'body-max-line-length': [2, 'always', 100],

// Exige linha em branco entre título e corpo
'body-leading-blank': [2, 'always'],

// Apenas avisa (não bloqueia) se não tiver escopo
'scope-empty': [1, 'never'],
```

---

## Passo 6 — Configurar o `package.json`

Adicione as seguintes seções ao `package.json`:

```json
{
  "type": "module",
  "scripts": {
    "prepare": "husky",
    "commit": "cz"
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  },
  "lint-staged": {
    "*.ts": ["prettier --write"],
    "*.{html,scss,css}": ["prettier --write"]
  },
  "prettier": {
    "printWidth": 100,
    "singleQuote": true,
    "overrides": [
      {
        "files": "*.html",
        "options": {
          "parser": "angular"
        }
      }
    ]
  }
}
```

---

## Passo 7 — Dar permissão de execução nos hooks

```bash
chmod +x .husky/pre-commit .husky/commit-msg
```

---

## Passo 8 — Commitar as configurações

```bash
git add .
git commit -m "chore: setup husky, commitizen, commitlint and lint-staged"
```

---

## Como usar no dia a dia

### Opção 1 — Menu interativo (recomendado)

```bash
git add .         # 1. adiciona os arquivos ao stage
npm run commit    # 2. abre o menu interativo do Commitizen
```

O menu guia você por cada campo da mensagem:

```
? Select the type of change that you're committing:
❯ feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
  test:     Adding missing tests or correcting existing tests
  build:    Changes that affect the build system or external dependencies
  ci:       Changes to CI configuration files and scripts
  chore:    Other changes that don't modify src or test files
  revert:   Reverts a previous commit

? What is the scope of this change? (press enter to skip)
? Write a short, imperative tense description of the change:
? Add a longer description? (press enter to skip)
? Are there any breaking changes? (y/N)
? Does this change affect any open issues? (y/N)
```

### Opção 2 — Commit direto

```bash
git add .
git commit -m "feat: adiciona tela de login"
```

Os hooks rodam normalmente em ambas as opções. A diferença é que o menu interativo ajuda a construir a mensagem corretamente, enquanto o commit direto exige que você já saiba o formato.

### O que acontece automaticamente

```
git commit (qualquer forma)
    │
    ├── pre-commit
    │       └── lint-staged formata os arquivos staged com Prettier
    │
    └── commit-msg
            └── commitlint valida se a mensagem segue o padrão
```

---

## Padrão de mensagens (Conventional Commits)

### Formato

```
<tipo>(<escopo opcional>): <descrição curta>
```

- O **tipo** é obrigatório e deve ser em minúsculo
- O **escopo** é opcional e identifica a área do código alterada
- A **descrição** é obrigatória, entre 10 e 72 caracteres, sem ponto final

### Tipos disponíveis

| Tipo | Quando usar |
|------|-------------|
| `feat` | Nova funcionalidade para o usuário |
| `fix` | Correção de bug |
| `docs` | Alterações apenas em documentação |
| `style` | Formatação, ponto e vírgula, espaços — sem mudança de lógica |
| `refactor` | Refatoração de código sem nova feature ou correção de bug |
| `perf` | Melhoria de performance |
| `test` | Adição ou correção de testes |
| `build` | Alterações no sistema de build ou dependências externas |
| `chore` | Tarefas de manutenção que não afetam o código de produção |
| `revert` | Reverte um commit anterior |

### Exemplos válidos

```bash
# Sem escopo
feat: adiciona tela de login
fix: corrige validacao no formulario de cadastro
docs: atualiza instrucoes de instalacao no README
chore: atualiza dependencias do projeto
refactor: extrai logica de validacao para service
test: adiciona testes unitarios no UserService
style: formata arquivos com prettier
perf: reduz tempo de carregamento da listagem
build: adiciona configuracao do eslint
revert: reverte commit de autenticacao com google

# Com escopo (area do sistema afetada)
feat(auth): implementa autenticacao com JWT
fix(api): trata erro 500 na requisicao de usuarios
feat(dashboard): adiciona grafico de vendas mensais
fix(formulario): corrige mascara do campo de telefone
refactor(user): separa responsabilidades do UserService
test(auth): cobre casos de token expirado
docs(api): documenta endpoints de autenticacao
chore(deps): atualiza angular para versao 21
```

### Exemplos inválidos (serão bloqueados)

```bash
arrumei um bug                    # ❌ sem tipo
Update                            # ❌ sem tipo e descrição muito curta
fix - corrige o botão             # ❌ formato incorreto, usar dois pontos
Fix: corrige o botão              # ❌ tipo com letra maiúscula
feat: ok                          # ❌ descrição muito curta (menos de 10 caracteres)
feat: adiciona a nova tela de login para o usuario acessar o sistema de gestao de pedidos  # ❌ título muito longo (mais de 72 caracteres)
feat: adiciona tela de login.     # ❌ descrição não pode terminar com ponto
```

---

## Para novos desenvolvedores no projeto

Ao clonar o repositório, basta rodar:

```bash
git clone <url-do-repositorio>
npm install
```

O script `prepare` no `package.json` ativa o Husky automaticamente após o `npm install`. Nenhuma configuração adicional é necessária.

---

## Solução de problemas

### Hook não está rodando

Verifique se o Husky está ativado:

```bash
npm run prepare
```

### Erro de permissão no hook

```bash
chmod +x .husky/pre-commit .husky/commit-msg
```

### Mensagem de commit rejeitada

O commitlint exibirá o erro com o motivo, por exemplo:

```
✖   header must not be longer than 72 characters, current length is 85
✖   subject may not be empty
✖   type must be one of [feat, fix, docs, ...]
```

Use `npm run commit` para o menu interativo construir a mensagem corretamente por você.

### Bypass emergencial (usar com cautela)

Em casos excepcionais, é possível pular os hooks com a flag `--no-verify`:

```bash
git commit -m "chore: mensagem" --no-verify
```

Evite usar no dia a dia — os hooks existem para manter a qualidade do histórico do projeto.
