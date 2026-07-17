# Plano ideal — Elogie+

## Decisão

A etapa de teste local manual pode ser pulada. O fluxo recomendado passa a ser: configurar Supabase, subir o código no GitHub e deixar Vercel/Azure Static Web Apps executar o build de validação.

Mesmo pulando o teste local, não pule a validação de publicação: o primeiro deploy deve ser tratado como homologação.

## Fase 1 — Publicação sem teste local manual

1. Criar repositório no GitHub.
2. Subir este projeto.
3. Criar projeto no Supabase.
4. Rodar a migration SQL incluída em `supabase/migrations/202607170001_initial_schema.sql`.
5. Configurar as variáveis de ambiente na plataforma de deploy:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Publicar na Vercel, Netlify ou Azure Static Web Apps.
7. Usar o próprio build da plataforma como validação.

## Fase 2 — Supabase

A migration incluída cria:

- `profiles`
- `feedbacks`
- `feedback_reactions`
- `celebrations`
- `celebration_reactions`
- `gratitude_posts`
- `gratitude_reactions`

Também cria:

- políticas RLS;
- função `is_admin()`;
- trigger para criar perfil automaticamente quando um usuário é criado no Auth.

## Fase 3 — Troca dos mocks por dados reais

As páginas principais foram alteradas para consultar e gravar no Supabase:

- `src/pages/FeedbacksPage.tsx`
- `src/pages/CelebrationsPage.tsx`
- `src/pages/GratitudePage.tsx`

Foram adicionados:

- `src/lib/types.ts`
- `src/lib/api/profiles.ts`
- `src/lib/api/feedbacks.ts`
- `src/lib/api/celebrations.ts`
- `src/lib/api/gratitude.ts`
- `src/hooks/useProfiles.ts`
- `src/hooks/useFeedbacks.ts`
- `src/hooks/useCelebrations.ts`
- `src/hooks/useGratitude.ts`

## Fase 4 — Deploy público/controlado

Recomendação: Vercel + Supabase.

Configuração esperada:

- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`

## Fase 5 — Homologação

Roteiro mínimo de homologação após deploy:

1. Entrar com usuário admin.
2. Criar 2 usuários pelo painel admin.
3. Fazer login com usuário comum.
4. Enviar um feedback.
5. Reagir ao feedback.
6. Criar uma comemoração.
7. Reagir à comemoração.
8. Publicar uma gratidão.
9. Curtir uma gratidão.
10. Testar em celular.

## Observação sobre dependências

Foi adicionada a dependência `@supabase/supabase-js` no `package.json`, pois o projeto já importava Supabase no código.

Se a plataforma reclamar de lockfile antigo, use `npm install` uma vez para atualizar o `package-lock.json`.
