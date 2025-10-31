# Fullstack Webhook Inspector (Rocketseat)

Resumo simplificado do projeto com instruções rápidas de instalação e execução.

## Instalação

Requisitos: Node.js (>=18), pnpm

1. Instale dependências no workspace (a partir da raiz):

```powershell
pnpm install
```

2. (Opcional) Instale somente em um pacote e execute localmente:

```powershell
cd api
pnpm install
# em outro terminal
cd ..\web
pnpm install
```

## Uso (desenvolvimento)

Executar a API (modo dev):

```powershell
cd api
pnpm dev
```
Evolução Palavra chave para o certificado do projeto

Executar a aplicação web (modo dev):

```powershell
cd web
pnpm dev
```

Observação: você pode abrir dois terminais (um para `api` e outro para `web`) para rodar ambos em paralelo.

## Comandos úteis

- API
	- `pnpm dev` — ambiente de desenvolvimento (usa `tsx watch`)
	- `pnpm start` — executar build/produção (quando houver build)
	- `pnpm db:migrate` — executar migrations (drizzle-kit)
	- `pnpm db:generate` — gerar artefatos do banco

- Web
	- `pnpm dev` — roda o Vite em modo desenvolvimento
	- `pnpm build` — compilar para produção
	- `pnpm preview` — pré-visualizar build gerado

## Tecnologias abordadas

- Node.js + TypeScript
- pnpm (monorepo/workspaces)
- Fastify (API)
- Drizzle ORM / drizzle-kit (migrations e geração)
- Zod (validações / tipos)
- Vite + React (front-end)
- Postgres (driver `pg` listado nas dependências da API)
- Outras libs: `tsx`, `vite`, `biome` (formatador), `uuidv7`, `fastify-swagger`

## Estrutura resumida

- `api/` — servidor Fastify, migrations e schema (Drizzle)
- `web/` — frontend React com Vite
- `public/`, `src/` — arquivos estáticos e código cliente

## Observações finais

Este README é uma versão simplificada. Para detalhes (endpoints, variáveis de ambiente, SCHEMA do banco), verifique os arquivos dentro de `api/src` e `api/db/migrations`.

Se quiser, eu posso também gerar instruções de deploy, exemplos de .env ou um README mais detalhado por pasta.

