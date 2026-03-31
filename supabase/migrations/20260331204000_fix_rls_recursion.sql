create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated, anon;

drop policy if exists "Public can view active products" on public.products;
create policy "Public can view active products"
on public.products
for select
using (active = true or public.is_admin());

drop policy if exists "Admins manage products" on public.products;
create policy "Admins manage products"
on public.products
for all
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users view own profile" on public.profiles;
create policy "Users view own profile"
on public.profiles
for select
using (id = auth.uid() or public.is_admin());

drop policy if exists "Users view own orders and admins view all" on public.orders;
create policy "Users view own orders and admins view all"
on public.orders
for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins update orders" on public.orders;
create policy "Admins update orders"
on public.orders
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users view own order items and admins view all" on public.order_items;
create policy "Users view own order items and admins view all"
on public.order_items
for select
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id and orders.user_id = auth.uid()
  )
  or public.is_admin()
);
