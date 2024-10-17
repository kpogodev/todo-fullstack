import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'

import type { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prismaClientPlugin: FastifyPluginAsync = fp(async (server) => {
  const prisma = new PrismaClient()

  server.decorate('prisma', prisma)

  server.addHook('onClose', async () => {
    await prisma.$disconnect()
  })
})

export default prismaClientPlugin
