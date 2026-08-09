function toSlug(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[-\s]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const LIST: Array<{ make: string; model: string }> = [
  { make: 'Fiat', model: 'Panda' },
  { make: 'Fiat', model: '500' },
  { make: 'Fiat', model: '500X' },
  { make: 'Fiat', model: 'Tipo' },
  { make: 'Volkswagen', model: 'Golf' },
  { make: 'Volkswagen', model: 'Polo' },
  { make: 'Volkswagen', model: 'T-Roc' },
  { make: 'Toyota', model: 'Yaris' },
  { make: 'Toyota', model: 'Corolla' },
  { make: 'Toyota', model: 'RAV4' },
  { make: 'Renault', model: 'Clio' },
  { make: 'Renault', model: 'Captur' },
  { make: 'Peugeot', model: '208' },
  { make: 'Peugeot', model: '2008' },
  { make: 'Citroën', model: 'C3' },
  { make: 'Citroën', model: 'C3 Aircross' },
  { make: 'Opel', model: 'Corsa' },
  { make: 'Opel', model: 'Astra' },
  { make: 'Dacia', model: 'Sandero' },
  { make: 'Dacia', model: 'Duster' },
  { make: 'Hyundai', model: 'i10' },
  { make: 'Hyundai', model: 'Tucson' },
  { make: 'Kia', model: 'Sportage' },
  { make: 'Nissan', model: 'Qashqai' },
  { make: 'Suzuki', model: 'Swift' },
  { make: 'Mazda', model: 'Mazda 3' },
  { make: 'BMW', model: 'Serie 1' },
  { make: 'BMW', model: 'Serie 3' },
  { make: 'Audi', model: 'A3' },
  { make: 'Audi', model: 'Q3' },
  { make: 'Mercedes-Benz', model: 'Classe A' },
  { make: 'Mercedes-Benz', model: 'Classe C' },
  { make: 'Volvo', model: 'XC40' },
  { make: 'Jeep', model: 'Renegade' },
  { make: 'Alfa Romeo', model: 'Giulia' },
  { make: 'Seat', model: 'Ibiza' },
  { make: 'Skoda', model: 'Octavia' },
  { make: 'Tesla', model: 'Model 3' },
  { make: 'Tesla', model: 'Model Y' },
  { make: 'MG', model: 'MG4' },
];

export const POPULAR_MODELS: Array<{ make: string; model: string; href: string }> = LIST.map(
  (item) => ({ ...item, href: `/valutazione/${toSlug(item.make)}/${toSlug(item.model)}` })
);
