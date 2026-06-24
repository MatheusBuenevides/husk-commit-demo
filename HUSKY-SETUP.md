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

Crie o arquivo `commitlint.config.js` na raiz do projeto:

```js
export default { extends: ['@commitlint/config-conventional'] };
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

### Fazendo um commit

```bash
git add .         # 1. adiciona os arquivos ao stage
npm run commit    # 2. abre o menu interativo do Commitizen
```

O menu interativo guia você pelo processo:

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

### O que acontece automaticamente

```
npm run commit
    │
    ├── lint-staged (pre-commit)
    │       └── formata os arquivos staged com Prettier
    │
    ├── commitizen
    │       └── abre o menu interativo para construir a mensagem
    │
    └── commitlint (commit-msg)
            └── valida se a mensagem segue o padrão
```

---

## Padrão de mensagens (Conventional Commits)

### Formato

```
<tipo>(<escopo opcional>): <descrição curta>
```

### Exemplos válidos

```bash
feat: adiciona tela de login
fix: corrige validação do formulário de cadastro
feat(auth): implementa autenticação com JWT
fix(api): trata erro 500 na requisição de usuários
docs: atualiza README com instruções de instalação
chore: atualiza dependências do projeto
refactor: extrai lógica de validação para service
test: adiciona testes unitários no UserService
style: formata arquivos com prettier
```

### Exemplos inválidos (serão bloqueados)

```bash
arrumei um bug              # ❌ sem tipo
Update                      # ❌ sem tipo e muito genérico
fix - corrige o botão       # ❌ formato incorreto
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

Certifique-se de usar o formato correto:
```
<tipo>: <descrição>
```
Ou use `npm run commit` para o menu interativo construir a mensagem por você.
