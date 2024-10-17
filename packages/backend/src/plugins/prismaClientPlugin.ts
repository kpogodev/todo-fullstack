import fp from 'fastify-plugin'
import { PrismaClient } from '@prisma/client'

import type { FastifyPluginAsync } from 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
  }
}

const prismaClientPlugin: FastifyPluginAsync = fp(async (app) => {
  const prisma = new PrismaClient()

  app.decorate('prisma', prisma)

  app.addHook('onClose', async () => {
    await prisma.$disconnect()
  })
})

export default prismaClientPlugin
