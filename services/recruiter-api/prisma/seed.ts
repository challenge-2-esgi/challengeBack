import { Address, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetDB() {
  prisma.company.deleteMany({});
  prisma.address.deleteMany({});
}

async function insertAddresses() {
  const a1 = await prisma.address.create({
    data: {
      streetNumber: '92',
      street: 'Rue Réaumur',
      city: 'Paris',
      postcode: '75002',
      state: 'Ile-of-France',
      country: 'France',
    },
  });
  const a2 = await prisma.address.create({
    data: {
      streetNumber: '5',
      street: 'Rue Guy Môquet',
      city: 'Orsay',
      postcode: '91400',
      state: 'Ile-of-France',
      country: 'France',
    },
  });

  return [a1, a2];
}

async function insertCompanies(addresses: Address[]) {
  if (addresses.length < 2) {
    throw new Error('need at least two addresses, check provided list');
  }

  await prisma.company.createMany({
    data: [
      {
        name: 'Rakuten',
        siren: '432647584',
        website: 'https://global.rakuten.com/corp/event/rakutentech/',
        sector: 'Artificial Intelligence',
        size: 130,
        description:
          'Rakuten a été créé en 1997 au Japon et est à l’origine du concept même de marketplace.',
        motivation:
          "Chez Rakuten France, la personnalité est importante : l'essentiel est d'être motivé, proactif, d'avoir le goût du challenge et l'amour du e-commerce. Et tout ça dans la bonne humeur !",
        ownerId: '',
        addressId: addresses[0].id,
      },
      {
        name: 'Coffreo',
        siren: '532432457',
        website: 'https://solutions.shopmium.com/',
        sector: 'Design & Engineering Office',
        size: 42,
        description:
          'Au cœur de la transformation digitale RH, Coffreo a créé une plateforme SaaS pour accélérer et fluidifier les échanges entre les agences d’intérim, les prestataires de l’événementiel, les traiteurs, les sociétés de sécurité, les organismes médicaux, … et leurs salariés temporaires.',
        motivation:
          'Pour relever les défis de demain, Coffreo parie sur des talents qui cherchent avant tout à rejoindre une aventure. Une aventure à taille humaine avec des projets ambitieux pour vous permettre de vous dépasser : transformer positivement le quotidien des salariés temporaires alors même qu’il est devenu encore plus incertain depuis la crise sanitaire.',
        ownerId: '',
        addressId: addresses[1].id,
      },
    ],
  });
}

async function main() {
  await resetDB();
  const addresses = await insertAddresses();
  await insertCompanies(addresses);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('error on seed ', e);
    await prisma.$disconnect();
    process.exit(1);
  });
