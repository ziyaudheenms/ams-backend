'use strict'

import authMiddleware from "@/middleware/auth"
import fastify, { FastifyInstance } from "fastify"
import os from "os"
import { FastifyRequest, FastifyReply } from "fastify";

export default async function (fastify: FastifyInstance) {

  fastify.setNotFoundHandler(function (req, reply) {
    reply.code(404).send({ message: 'You are looking at the wrong path! ￣へ￣', status: 404 })
  })

  fastify.get("/", async () => {
    return {
      message: "Hi User <3 - AMS Backend Server",
      version: process.env.VERSION || "dev",
      timestamp: new Date().toISOString(),
    };
  });

  fastify.get("/health", async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const error = new Error("Database query failed"); // or caught from catch (err)

    return reply.status(500).send({
      status_code: 500,
      message: "Failed to retrieve batches",
      error: error.message || "Unknown error", // Extract the string message!
    });
  })

}
