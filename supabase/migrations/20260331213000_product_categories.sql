alter table public.products
add column if not exists category text;

update public.products
set category = case
  when name in ('Banana', 'Laranja pera', 'Laranja lima', 'Goiaba', 'Abacote', 'Acerola', 'Maracuja', 'Melancia', 'Limao') then 'Frutas'
  when name in ('Abobora', 'Maxixe', 'Quiabo') then 'Verduras e Legumes'
  when name in ('Macaxeira', 'Macaxeira a vacuo', 'Batata doce', 'Inhame') then 'Raizes'
  when name in ('Fava verde', 'Fava debulhada', 'Feijao verde de corda', 'Feijao debulhado') then 'Graos'
  when name in ('Couve', 'Coentro', 'Cebolinha') then 'Hortalicas'
  when name in ('Nego bom alimentado') then 'Doces'
  when name in ('Bolo de massa puba', 'Pao de inhame', 'Biscoito de laranja doce', 'Biscoito de batata doce', 'Doce de leite') then 'Bolos, Paes e Biscoitos'
  when name in ('Molho de pimenta malagueta', 'Pimenta malagueta em conserva', 'Pimenta biquinho em conserva', 'Pimenta com vinagre balsamico') then 'Conservas e Derivados'
  when name in ('Licor de genipapo 150 ml', 'Licor de genipapo 270 ml', 'Licor de genipapo 1 litro') then 'Bebidas Artesanais'
  when name in ('Mel de abelha italiana', 'Mel de abelhas italiana aps', 'Mel de abelhas com pimenta') then 'Extrativismo Sustentavel'
  when name in ('Ovo caipira', 'Galinha caipira') then 'Proteinas'
  else coalesce(category, 'Outros')
end;
