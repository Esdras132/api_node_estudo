import { z } from "zod";
import { FastifyTypedInstance } from "../types";

interface TextModel {
    texto: string;
}
const texts: TextModel[] = [];

export async function routes(app: FastifyTypedInstance) {
    app.get("", {
        schema: {
            tags: ["Text"],
            description: "Get a Text",
            response: {
                200: z.array(z.object({
                    texto: z.string(),
                })),
            },
        },
    }, async () => {
        return texts;
    });

    app.post("", {
        schema: {
            tags: ["Text"],
            description: "Create a new Text",
            body: z.object({
                text: z.string().min(1, "Text is required"),
            }),
            response: {
                201: z.object({ status: z.literal("success") }).describe("Response will be success on success"),
                400: z.object({
                    message: z.string().describe("Error message"),
                }).describe("Bad Request Error"),
                500: z.object({
                    message: z.string().describe("Error message"),
                }).describe("Internal Server Error"),
            },
        }
    }, async (request, reply) => {
        const { text } = request.body;

        try {
            texts.push({
                texto: text
            });

            return reply.status(201).send({ status: "success" });
        } catch (error) {
            return reply.status(500).send({ message: "Internal Server Error" });
        }
    });
}

