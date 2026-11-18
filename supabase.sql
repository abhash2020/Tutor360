
-- Tutor360 Profile Database

create table if not exists public.profiles (
  id uuid primary key
    references auth.users(id) on delete cascade,
  role text not null
    check (role in ('tutor', 'parent')),
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security

alter table public.profiles
enable row level security;

-- Users can read only their own profiles

drop policy if exists "Read own profile"
on public.profiles;

create policy "Read own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

-- Automatically create profile on signup

create or replace function public.create_tutor360_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  account_role text;
  account_details jsonb;
begin
  account_role := new.raw_user_meta_data ->> 'role';
  account_details := new.raw_user_meta_data -> 'profile';

  if account_role not in ('tutor', 'parent')
     or account_details is null
     or jsonb_typeof(account_details) <> 'object'
  then
    raise exception 'Invalid registration information';
  end if;

  insert into public.profiles (
    id,
    role,
    details
  )
  values (
    new.id,
    account_role,
    account_details
  );

  return new;
end;
$$;

drop trigger if exists tutor360_signup_trigger
on auth.users;

create trigger tutor360_signup_trigger
after insert on auth.users
for each row
execute function public.create_tutor360_profile();

-- Allow signed-in users to read their own rows

grant usage on schema public to authenticated;
grant select on public.profiles to authenticated;
