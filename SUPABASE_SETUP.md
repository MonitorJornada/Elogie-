-- Elogie+ - schema inicial Supabase
-- Execute no SQL Editor do Supabase antes de publicar o front-end.

create extension if not exists pgcrypto;

-- =========================
-- Profiles
-- =========================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null unique,
  avatar_url text,
  role text not null default 'member' check (role in ('admin', 'member')),
  department text,
  company_id text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create or replace function public.is_admin(user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1), 'Usuário'),
    new.email,
    'member'
  )
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(public.profiles.name, excluded.name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

create policy "profiles_update_self_or_admin"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- =========================
-- Feedbacks
-- =========================
create table if not exists public.feedbacks (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references public.profiles(id) on delete cascade,
  to_user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null check (char_length(trim(message)) > 0),
  is_anonymous boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.feedbacks enable row level security;

create index if not exists feedbacks_created_at_idx on public.feedbacks(created_at desc);
create index if not exists feedbacks_from_user_id_idx on public.feedbacks(from_user_id);
create index if not exists feedbacks_to_user_id_idx on public.feedbacks(to_user_id);

create policy "feedbacks_select_authenticated"
  on public.feedbacks for select
  to authenticated
  using (true);

create policy "feedbacks_insert_own_sender"
  on public.feedbacks for insert
  to authenticated
  with check (auth.uid() = from_user_id);

create policy "feedbacks_update_own_or_admin"
  on public.feedbacks for update
  to authenticated
  using (auth.uid() = from_user_id or public.is_admin())
  with check (auth.uid() = from_user_id or public.is_admin());

create policy "feedbacks_delete_own_or_admin"
  on public.feedbacks for delete
  to authenticated
  using (auth.uid() = from_user_id or public.is_admin());

create table if not exists public.feedback_reactions (
  id uuid primary key default gen_random_uuid(),
  feedback_id uuid not null references public.feedbacks(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  emoji text not null check (emoji in ('❤️', '👏', '🔥')),
  created_at timestamptz not null default now(),
  unique (feedback_id, user_id, emoji)
);

alter table public.feedback_reactions enable row level security;

create index if not exists feedback_reactions_feedback_id_idx on public.feedback_reactions(feedback_id);

create policy "feedback_reactions_select_authenticated"
  on public.feedback_reactions for select
  to authenticated
  using (true);

create policy "feedback_reactions_insert_own"
  on public.feedback_reactions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "feedback_reactions_delete_own"
  on public.feedback_reactions for delete
  to authenticated
  using (auth.uid() = user_id);

-- =========================
-- Comemorações
-- =========================
create table if not exists public.celebrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('birthday', 'admission', 'achievement', 'baby', 'wedding', 'custom')),
  title text not null check (char_length(trim(title)) > 0),
  description text not null check (char_length(trim(description)) > 0),
  celebration_date date not null,
  created_at timestamptz not null default now()
);

alter table public.celebrations enable row level security;

create index if not exists celebrations_date_idx on public.celebrations(celebration_date desc);
create index if not exists celebrations_user_id_idx on public.celebrations(user_id);

create policy "celebrations_select_authenticated"
  on public.celebrations for select
  to authenticated
  using (true);

create policy "celebrations_insert_authenticated"
  on public.celebrations for insert
  to authenticated
  with check (auth.uid() = created_by);

create policy "celebrations_update_creator_or_admin"
  on public.celebrations for update
  to authenticated
  using (auth.uid() = created_by or public.is_admin())
  with check (auth.uid() = created_by or public.is_admin());

create policy "celebrations_delete_creator_or_admin"
  on public.celebrations for delete
  to authenticated
  using (auth.uid() = created_by or public.is_admin());

create table if not exists public.celebration_reactions (
  id uuid primary key default gen_random_uuid(),
  celebration_id uuid not null references public.celebrations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  emoji text not null default '🎉' check (emoji in ('🎉')),
  created_at timestamptz not null default now(),
  unique (celebration_id, user_id, emoji)
);

alter table public.celebration_reactions enable row level security;

create index if not exists celebration_reactions_celebration_id_idx on public.celebration_reactions(celebration_id);

create policy "celebration_reactions_select_authenticated"
  on public.celebration_reactions for select
  to authenticated
  using (true);

create policy "celebration_reactions_insert_own"
  on public.celebration_reactions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "celebration_reactions_delete_own"
  on public.celebration_reactions for delete
  to authenticated
  using (auth.uid() = user_id);

-- =========================
-- Quadro da gratidão
-- =========================
create table if not exists public.gratitude_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null check (char_length(trim(message)) > 0),
  is_anonymous boolean not null default false,
  color text not null default 'bg-postit-yellow',
  created_at timestamptz not null default now()
);

alter table public.gratitude_posts enable row level security;

create index if not exists gratitude_posts_created_at_idx on public.gratitude_posts(created_at desc);

create policy "gratitude_posts_select_authenticated"
  on public.gratitude_posts for select
  to authenticated
  using (true);

create policy "gratitude_posts_insert_own"
  on public.gratitude_posts for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "gratitude_posts_update_own_or_admin"
  on public.gratitude_posts for update
  to authenticated
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

create policy "gratitude_posts_delete_own_or_admin"
  on public.gratitude_posts for delete
  to authenticated
  using (auth.uid() = user_id or public.is_admin());

create table if not exists public.gratitude_reactions (
  id uuid primary key default gen_random_uuid(),
  gratitude_id uuid not null references public.gratitude_posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  emoji text not null default '❤️' check (emoji in ('❤️')),
  created_at timestamptz not null default now(),
  unique (gratitude_id, user_id, emoji)
);

alter table public.gratitude_reactions enable row level security;

create index if not exists gratitude_reactions_gratitude_id_idx on public.gratitude_reactions(gratitude_id);

create policy "gratitude_reactions_select_authenticated"
  on public.gratitude_reactions for select
  to authenticated
  using (true);

create policy "gratitude_reactions_insert_own"
  on public.gratitude_reactions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "gratitude_reactions_delete_own"
  on public.gratitude_reactions for delete
  to authenticated
  using (auth.uid() = user_id);
