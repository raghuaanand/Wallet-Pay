import { P2PTransfers } from "../../../components/P2PTransfer"
import { SendCard } from "../../../components/SensCard"
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";

async function getP2PTransfer() {
    const session = await getServerSession(authOptions);
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id)
        }
    });
    return txns.map(t => ({
        to: t.toUserId,
        time: t.timestamp,
        amount: t.amount,
    }))
}

export default async function() {
    const transactions = await getP2PTransfer();
    return <div className="w-full flex justify-center items-center gap-10">
        <SendCard />
        <P2PTransfers transactions={transactions} />
    </div>
}