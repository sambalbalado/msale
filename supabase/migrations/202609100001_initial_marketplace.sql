-- msale's first production schema. The app intentionally contains no payment data.
create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 60),
  avatar_url text,
  bio text check (char_length(bio) <= 240),
  state text not null default 'Malaysia',
  languages text[] not null default array['en']::text[],
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  response_rate integer not null default 0 check (response_rate between 0 and 100),
  verified boolean not null default false,
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  slug text primary key,
  label_en text not null,
  label_ms text not null,
  label_zh text not null,
  icon text not null,
  sort_order integer not null default 0
);

insert into public.categories (slug, label_en, label_ms, label_zh, icon, sort_order) values
  ('furniture', 'Furniture', 'Perabot', '家具', 'chair-rolling', 10),
  ('electronics', 'Electronics', 'Elektronik', '电子产品', 'devices', 20),
  ('fashion', 'Fashion', 'Fesyen', '时尚', 'checkroom', 30),
  ('vehicles', 'Vehicles', 'Kenderaan', '交通工具', 'directions-car', 40),
  ('hobbies', 'Hobbies', 'Hobi', '兴趣爱好', 'palette', 50),
  ('home', 'Home', 'Rumah', '家居', 'home-filled', 60),
  ('sports', 'Sports', 'Sukan', '运动', 'sports-basketball', 70),
  ('other', 'Other', 'Lain-lain', '其他', 'category', 80)
on conflict (slug) do update set
  label_en = excluded.label_en, label_ms = excluded.label_ms, label_zh = excluded.label_zh,
  icon = excluded.icon, sort_order = excluded.sort_order;

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 5 and 80),
  description text not null check (char_length(description) between 20 and 2000),
  price numeric(12,2) not null check (price > 0 and price <= 1000000),
  currency text not null default 'MYR' check (currency = 'MYR'),
  condition text not null check (condition in ('new', 'like_new', 'good', 'fair')),
  category_slug text not null references public.categories(slug),
  state text not null,
  area text not null check (char_length(area) between 2 and 80),
  latitude numeric(9,6),
  longitude numeric(9,6),
  meetup_notes text check (char_length(meetup_notes) <= 240),
  status text not null default 'draft' check (status in ('draft', 'active', 'reserved', 'sold', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  search_document tsvector generated always as (
    to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(area, '') || ' ' || coalesce(state, ''))
  ) stored
);

create table public.listing_images (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  storage_path text not null unique,
  public_url text not null,
  sort_order smallint not null default 0 check (sort_order between 0 and 7),
  created_at timestamptz not null default now(),
  unique (listing_id, sort_order)
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid not null references public.listings(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete cascade,
  seller_id uuid not null references public.profiles(id) on delete cascade,
  last_message_preview text not null default '',
  last_message_at timestamptz,
  buyer_last_read_at timestamptz,
  seller_last_read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (buyer_id <> seller_id),
  unique (listing_id, buyer_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 2000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete cascade,
  reviewee_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text check (char_length(body) <= 600),
  created_at timestamptz not null default now(),
  check (reviewer_id <> reviewee_id),
  unique (conversation_id, reviewer_id)
);

create table public.blocked_users (
  blocker_id uuid not null references public.profiles(id) on delete cascade,
  blocked_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (blocker_id <> blocked_id),
  primary key (blocker_id, blocked_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  listing_id uuid references public.listings(id) on delete set null,
  reported_user_id uuid references public.profiles(id) on delete set null,
  reason text not null check (reason in ('scam', 'prohibited', 'harassment', 'spam', 'misleading', 'other')),
  details text check (char_length(details) <= 1000),
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default now(),
  check (listing_id is not null or reported_user_id is not null)
);

create index listings_active_created_idx on public.listings (created_at desc) where status = 'active';
create index listings_category_state_idx on public.listings (category_slug, state) where status = 'active';
create index listings_search_idx on public.listings using gin (search_document);
create index listing_images_listing_idx on public.listing_images (listing_id, sort_order);
create index conversations_buyer_idx on public.conversations (buyer_id, last_message_at desc);
create index conversations_seller_idx on public.conversations (seller_id, last_message_at desc);
create index messages_conversation_idx on public.messages (conversation_id, created_at);

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger listings_set_updated_at before update on public.listings
for each row execute function public.set_updated_at();
create trigger conversations_set_updated_at before update on public.conversations
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(nullif(new.raw_user_meta_data ->> 'display_name', ''), split_part(new.email, '@', 1), 'msale member'));
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_conversation_after_message()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  update public.conversations
  set last_message_preview = left(new.body, 140), last_message_at = new.created_at, updated_at = new.created_at
  where id = new.conversation_id;
  return new;
end;
$$;

create trigger messages_touch_conversation after insert on public.messages
for each row execute function public.touch_conversation_after_message();

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.listings enable row level security;
alter table public.listing_images enable row level security;
alter table public.favorites enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.blocked_users enable row level security;
alter table public.reports enable row level security;

create policy "Profiles are publicly readable" on public.profiles for select using (true);
create policy "Members update their profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "Categories are publicly readable" on public.categories for select using (true);

create policy "Active listings are publicly readable" on public.listings for select
using (status = 'active' or seller_id = auth.uid());
create policy "Members create their listings" on public.listings for insert
with check (seller_id = auth.uid());
create policy "Sellers update their listings" on public.listings for update
using (seller_id = auth.uid()) with check (seller_id = auth.uid());
create policy "Sellers delete their listings" on public.listings for delete
using (seller_id = auth.uid());

create policy "Listing images are publicly readable" on public.listing_images for select using (true);
create policy "Sellers create listing images" on public.listing_images for insert
with check (exists (select 1 from public.listings where listings.id = listing_id and listings.seller_id = auth.uid()));
create policy "Sellers update listing images" on public.listing_images for update
using (exists (select 1 from public.listings where listings.id = listing_id and listings.seller_id = auth.uid()));
create policy "Sellers delete listing images" on public.listing_images for delete
using (exists (select 1 from public.listings where listings.id = listing_id and listings.seller_id = auth.uid()));

create policy "Members read their favorites" on public.favorites for select using (user_id = auth.uid());
create policy "Members save listings" on public.favorites for insert with check (user_id = auth.uid());
create policy "Members remove favorites" on public.favorites for delete using (user_id = auth.uid());

create policy "Participants read conversations" on public.conversations for select
using (auth.uid() in (buyer_id, seller_id));
create policy "Buyers start valid conversations" on public.conversations for insert
with check (
  buyer_id = auth.uid()
  and seller_id = (select listings.seller_id from public.listings where listings.id = listing_id and listings.status = 'active')
  and buyer_id <> seller_id
);
create policy "Participants update conversations" on public.conversations for update
using (auth.uid() in (buyer_id, seller_id)) with check (auth.uid() in (buyer_id, seller_id));

create policy "Participants read messages" on public.messages for select
using (exists (select 1 from public.conversations where conversations.id = conversation_id and auth.uid() in (buyer_id, seller_id)));
create policy "Participants send messages" on public.messages for insert
with check (
  sender_id = auth.uid()
  and exists (select 1 from public.conversations where conversations.id = conversation_id and auth.uid() in (buyer_id, seller_id))
);
create policy "Participants mark messages read" on public.messages for update
using (exists (select 1 from public.conversations where conversations.id = conversation_id and auth.uid() in (buyer_id, seller_id)));

create policy "Reviews are publicly readable" on public.reviews for select using (true);
create policy "Participants create reviews" on public.reviews for insert
with check (
  reviewer_id = auth.uid()
  and exists (
    select 1 from public.conversations
    where conversations.id = conversation_id
      and auth.uid() in (buyer_id, seller_id)
      and reviewee_id in (buyer_id, seller_id)
  )
);

create policy "Members manage their blocks" on public.blocked_users for all
using (blocker_id = auth.uid()) with check (blocker_id = auth.uid());
create policy "Members read their reports" on public.reports for select using (reporter_id = auth.uid());
create policy "Members create reports" on public.reports for insert with check (reporter_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('listing-images', 'listing-images', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Listing photos are public" on storage.objects for select
using (bucket_id = 'listing-images');
create policy "Members upload their listing photos" on storage.objects for insert
with check (bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Members update their listing photos" on storage.objects for update
using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "Members delete their listing photos" on storage.objects for delete
using (bucket_id = 'listing-images' and (storage.foldername(name))[1] = auth.uid()::text);

alter publication supabase_realtime add table public.messages;

