import { PrismaClient } from "@prisma/client"

const main = async() => {
    const db = new PrismaClient()
    // define a value greater than max i64
    const bigval = 32000000000000000000n

    // value is correctly printed by node
    console.log('bigval is', bigval)

    // This will throw a PrismaClientKnownRequestError error of P2033
    // Query parsing failure: A number used in the query does not fit into a 64 bit signed integer. Consider using `BigInt` as field 
    // type if you're trying to store large integers.
    await db.nft.create({ data: { price: bigval }})
}

main().catch(console.error)