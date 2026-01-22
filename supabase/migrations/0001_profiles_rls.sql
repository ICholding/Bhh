-- Create profiles table with role-based access
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'client',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint valid_role check (role in ('client', 'worker', 'employee', 'admin'))
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Create policies
-- Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Create auto-create profile trigger function
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger on auth.users to auto-create profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Create updated_at trigger function
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Create index for role-based queries
create index profiles_role_idx on public.profiles(role);

-- Grant necessary permissions
grant usage on schema public to anon, authenticated;
grant all on public.profiles to authenticated;
grant select on public.profiles to anon;
