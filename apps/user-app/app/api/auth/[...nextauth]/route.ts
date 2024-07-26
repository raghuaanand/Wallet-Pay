import NextAuth from "next-auth"
import { authOptions } from "../../../lib/auth"

const handler = NextAuth(authOptions)

// this is same as export const GET = handler; export const POST = handler;
export { handler as GET, handler as POST }