-- Legacy rows retain their original data and can still be read by their owners.
alter table public.businesses add column questionnaire jsonb;

create policy "new businesses serve meals for immediate consumption"
on public.businesses as restrictive for insert to authenticated
with check (
  jsonb_typeof(questionnaire) = 'object'
  and questionnaire->>'P01_SCOPE' = 'Sí, es mi actividad principal'
  and jsonb_typeof(questionnaire->'P02') = 'string'
  and nullif(btrim(questionnaire->>'P02'), '') is not null
  and questionnaire->>'P01' in (
    'Restaurante / alimentos', 'Restaurante', 'Cafetería', 'Pollería', 'Cevichería',
    'Pizzería', 'Comida rápida', 'Restaurante de menú o comida casera',
    'Comida para llevar', 'Cocina exclusiva para delivery', 'Food truck o puesto móvil',
    'Otro establecimiento similar de comidas'
  )
);

update public.business_activities
set active = false
where category <> 'Alimentos y bebidas';
