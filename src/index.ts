import { PrismaClient } from "@prisma/client"

const main = async() => {
    const db = new PrismaClient()
    const bigval = 32000000000000000000n

    console.log('bigval is', bigval)

    await db.nft.create({ data: { price: bigval }})
}

main().catch(console.error)