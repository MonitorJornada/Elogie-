# Configuração Supabase — Elogie+

## 1. Criar projeto

Crie um projeto no Supabase e copie:

- Project URL
- anon/public key

Depois configure no deploy:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLIC
```

## 2. Rodar a migration

No Supabase, abra:

`SQL Editor` → `New query`

Cole e execute o arquivo:

`supabase/migrations/202607170001_initial_schema.sql`

## 3. Criar o primeiro usuário admin

Como o painel admin só funciona depois que já existe um admin, crie o primeiro usuário diretamente no Supabase:

1. Vá em `Authentication` → `Users`.
2. Crie um usuário com e-mail e senha.
3. Rode no SQL Editor, trocando o e-mail:

```sql
update public.profiles
set role = 'admin', name = 'Administrador'
where email = 'email-do-admin@empresa.com';
```

Depois disso, entre no app com esse usuário e crie os demais colaboradores pelo painel Admin.

## 4. Publicar Edge Functions

O projeto usa duas funções:

- `create-user`
- `delete-user`

Elas precisam estar publicadas no Supabase Functions.

Via CLI, dentro do projeto:

```bash
supabase functions deploy create-user
supabase functions deploy delete-user
```

As funções usam `SUPABASE_SERVICE_ROLE_KEY`, disponível no ambiente do Supabase Functions. Não coloque service role no front-end.

## 5. Configurar URLs de autenticação

No Supabase, vá em:

`Authentication` → `URL Configuration`

Configure:

- Site URL: URL final do app publicado.
- Redirect URLs: URL final do app publicado e, se quiser, a URL de preview da Vercel.
