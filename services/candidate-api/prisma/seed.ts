import { ApplicationStatus, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
    // applications
    await prisma.application.create({
        data: {
            userId: "94b6267a-852d-4171-b0c2-5743ef2707f9",
            offerId: "a3380e3a-c8a1-4cb5-8703-8b84b6510e6b",
            motivation: "I am excited about this opportunity and believe I am a great fit for the role.",
            cv: "Sample CV content..."
        }
    });

    await prisma.application.create({
        data: {
            userId: "1a92722d-3126-4f37-b68f-3723d46aa371",
            offerId: "ff6e345f-2f2c-47dc-ab9c-8df88603ef5f",
            motivation: "I have relevant experience and skills for this position. Looking forward to the opportunity!",
            cv: "Sample CV content...",
            status: ApplicationStatus.ACCEPTED
        }
    });

    await prisma.application.create({
        data: {
            userId: "0b44c7eb-966c-49c9-afef-f23caa957e7b",
            offerId: "59a20ce6-c183-4f83-a5e5-dd3097fe6393",
            motivation: "Although I am interested in this role, I understand if there are more suitable candidates. Thank you for considering my application.",
            cv: "Sample CV content...",
            status: ApplicationStatus.REFUSED
        }
    });

    // bookmarks
    await prisma.bookmark.create({
        data: {
            offerId: "a3380e3a-c8a1-4cb5-8703-8b84b6510e6b",
            userId: "94b6267a-852d-4171-b0c2-5743ef2707f9"
        }
    })

    await prisma.bookmark.create({
        data: {
            offerId: "59a20ce6-c183-4f83-a5e5-dd3097fe6393",
            userId: "94b6267a-852d-4171-b0c2-5743ef2707f9"
        }
    })

    
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })