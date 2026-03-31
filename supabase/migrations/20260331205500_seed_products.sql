with source_products (name, description, price, unit, active) as (
  values
    ('Banana', 'Categoria: Frutas. Referencia da cesta: duzia.', 6.00, 'duzia', true),
    ('Laranja pera', 'Categoria: Frutas. Referencia da cesta: 4 unidades.', 2.00, '4 unidades', true),
    ('Laranja lima', 'Categoria: Frutas. Referencia da cesta: 4 unidades.', 2.00, '4 unidades', true),
    ('Goiaba', 'Categoria: Frutas.', 5.00, 'kg', true),
    ('Abacote', 'Categoria: Frutas. Referencia da cesta: unidade.', 3.00, 'unidade', true),
    ('Acerola', 'Categoria: Frutas. Referencia da cesta: 500g.', 6.00, '500g', true),
    ('Maracuja', 'Categoria: Frutas. Referencia da cesta: 4 unidades.', 5.00, '4 unidades', true),
    ('Melancia', 'Categoria: Frutas.', 3.50, 'kg', true),
    ('Limao', 'Categoria: Frutas. Referencia da cesta: unidade.', 0.50, 'unidade', true),
    ('Abobora', 'Categoria: Verduras e Legumes.', 5.00, 'kg', true),
    ('Maxixe', 'Categoria: Verduras e Legumes. Referencia da cesta: unidade.', 0.10, 'unidade', true),
    ('Quiabo', 'Categoria: Verduras e Legumes. Referencia da cesta: unidade.', 0.10, 'unidade', true),
    ('Macaxeira', 'Categoria: Raizes.', 5.00, 'kg', true),
    ('Macaxeira a vacuo', 'Categoria: Raizes.', 8.00, 'kg', true),
    ('Batata doce', 'Categoria: Raizes.', 5.00, 'kg', true),
    ('Inhame', 'Categoria: Raizes.', 10.00, 'kg', true),
    ('Fava verde', 'Categoria: Graos.', 10.00, 'kg', true),
    ('Fava debulhada', 'Categoria: Graos.', 25.00, 'kg', true),
    ('Feijao verde de corda', 'Categoria: Graos.', 10.00, 'kg', true),
    ('Feijao debulhado', 'Categoria: Graos.', 25.00, 'kg', true),
    ('Couve', 'Categoria: Horticolas. Referencia da cesta: maco.', 2.00, 'maco', true),
    ('Coentro', 'Categoria: Horticolas. Referencia da cesta: maco.', 2.00, 'maco', true),
    ('Cebolinha', 'Categoria: Horticolas. Referencia da cesta: maco.', 2.00, 'maco', true),
    ('Nego bom alimentado', 'Categoria: Doces. Referencia da cesta: 200g.', 10.00, '200g', true),
    ('Bolo de massa puba', 'Categoria: Bolos, Paes e Biscoitos. Referencia da cesta: 1kg.', 25.00, '1kg', true),
    ('Pao de inhame', 'Categoria: Bolos, Paes e Biscoitos. Referencia da cesta: 150g.', 1.50, '150g', true),
    ('Biscoito de laranja doce', 'Categoria: Bolos, Paes e Biscoitos.', 25.00, 'kg', true),
    ('Biscoito de batata doce', 'Categoria: Bolos, Paes e Biscoitos.', 25.00, 'kg', true),
    ('Doce de leite', 'Categoria: Bolos, Paes e Biscoitos. Referencia da cesta: 300g.', 18.00, '300g', true),
    ('Molho de pimenta malagueta', 'Categoria: Conservas e Derivados. Referencia da cesta: 150g.', 5.00, '150g', true),
    ('Pimenta malagueta em conserva', 'Categoria: Conservas e Derivados. Referencia da cesta: 150g.', 5.00, '150g', true),
    ('Pimenta biquinho em conserva', 'Categoria: Conservas e Derivados. Referencia da cesta: 200g.', 8.00, '200g', true),
    ('Pimenta com vinagre balsamico', 'Categoria: Conservas e Derivados. Referencia da cesta: 150g.', 6.00, '150g', true),
    ('Licor de genipapo 150 ml', 'Categoria: Bebidas Artesanais.', 15.00, 'garrafa', true),
    ('Licor de genipapo 270 ml', 'Categoria: Bebidas Artesanais.', 25.00, 'garrafa', true),
    ('Licor de genipapo 1 litro', 'Categoria: Bebidas Artesanais.', 50.00, 'garrafa', true),
    ('Mel de abelha italiana', 'Categoria: Extrativismo Sustentavel. Referencia da cesta: vidro 440g.', 30.00, '440g', true),
    ('Mel de abelha italiana', 'Categoria: Extrativismo Sustentavel. Referencia da cesta: 280g.', 20.00, '280g', true),
    ('Mel de abelhas italiana aps', 'Categoria: Extrativismo Sustentavel. Referencia da cesta: 150g.', 11.00, '150g', true),
    ('Mel de abelhas com pimenta', 'Categoria: Extrativismo Sustentavel. Referencia da cesta: 150g.', 15.00, '150g', true),
    ('Ovo caipira', 'Categoria: Proteinas. Referencia da cesta: 30 unidades.', 20.00, '30 unidades', true),
    ('Galinha caipira', 'Categoria: Proteinas. Referencia da cesta: unidade.', 50.00, 'unidade', true)
)
insert into public.products (name, description, price, unit, active)
select sp.name, sp.description, sp.price, sp.unit, sp.active
from source_products sp
where not exists (
  select 1
  from public.products p
  where lower(p.name) = lower(sp.name)
    and lower(p.unit) = lower(sp.unit)
);
