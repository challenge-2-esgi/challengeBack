import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Address, Company, JobOffer, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const elasticsearchService = new ElasticsearchService({
  node: process.env.ELASTICSEARCH_NODE,
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME,
    password: process.env.ELASTICSEARCH_PASSWORD,
  },
});

interface JobOfferSearchBody {
  id: string;
  title: string;
  description: string;
}

const indexPost = (jobOffer: JobOffer) => {
  return elasticsearchService.index<JobOfferSearchBody>({
    index: 'job-offer',
    body: {
      id: jobOffer.id,
      title: jobOffer.title,
      description: jobOffer.description,
    },
  });
};

async function resetDB() {
  await prisma.jobOffer.deleteMany();
  await prisma.company.deleteMany();
  await prisma.address.deleteMany();
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

  const c1 = await prisma.company.create({
    data: {
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
  });

  const c2 = await prisma.company.create({
    data: {
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
  });

  return [c1, c2];
}

async function insertJobOffers(companies: Company[]) {
  if (companies.length < 2) {
    throw new Error('need at least two companies, check provided list');
  }

  const createJob1 = await prisma.jobOffer.create({
    data: {
      title: 'Développeur React',
      description:
        'Le développement Web est votre expertise. Vous êtes rattaché au Lead développeur.',
      contractType: 'CDI',
      experience: 'THREE_TO_FIVE_YEARS',
      tasks: [
        'Réaliser les travaux de conception et de développement',
        'Elaboration des cahiers de recette et suivi des recettes.',
      ],
      skills: ['javascript', 'react native'],
      remoteDays: 3,
      remuneration: 60,
      startDate: new Date('2023-09-01'),
      category: 'Développement Informatique',
      companyId: companies[0].id,
    },
  });

  const createJob2 = await prisma.jobOffer.create({
    data: {
      title: 'Développeur fullstack Python / Vue.js',
      description:
        'Centre de recherche dédié à la transition énergétique et écologique des villes qui regroupe des chercheurs travaillant à développer des solutions innovantes pour construire une ville efficiente énergétiquement et décarbonée.',
      contractType: 'CDI',
      experience: 'SIX_TO_TEN_YEARS',
      tasks: [
        'Documenter et réaliser les tests automatisés (unitaire et d intégration)',
        'Participer à la maintenance en condition opérationnelle de nos logiciels ',
        'Participer aux cérémonies agiles.',
      ],
      skills: ['Python', 'Vuejs', 'django', 'fastAPi'],
      remoteDays: 1,
      remuneration: 54,
      startDate: new Date('2023-09-01'),
      category: 'Développement Informatique',
      companyId: companies[0].id,
    },
  });

  const createJob3 = await prisma.jobOffer.create({
    data: {
      title: 'Alternance - Ingénieur Mise en Réseau F/H',
      description:
        "Vous êtes motivé par la gestion d'activité dans un environnement technologique, avec une place prépondérante donnée à la technique des Réseaux ?",
      contractType: 'ALTERNANCE',
      tasks: [
        " Piloter les interventions d'installation et migration Data (VPN MPLS et Accès Internet) et installation et portabilité Voix (PBX et Centrex)",
        'Coordonner les équipes de techniciens installateurs intervenant sur les sites des clients.',
        "Communiquer sur l'avancement de vos dossiers avec les chefs de projet déploiement.",
      ],
      skills: ['Python', 'Vuejs', 'django', 'fastAPi'],
      startDate: new Date('2023-09-04'),
      category: 'Infra, Réseaux, Télécoms',
      duration: '12 mois',
      companyId: companies[1].id,
    },
  });

  indexPost(createJob1);
  indexPost(createJob2);
  indexPost(createJob3);

  const jobsArray = [createJob1, createJob2, createJob3];

  return jobsArray;
}

async function main() {
  await resetDB();
  const addresses = await insertAddresses();
  const companies = await insertCompanies(addresses);
  await insertJobOffers(companies);
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
