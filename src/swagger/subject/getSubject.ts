export default {
  get: {
    summary: "Consulta todos os assuntos (subjects)",
    description:
      "Esta rota é responsável por consultar todos os assuntos (subjects).",
    tags: ["Subjects"],
    parameters: [],
    security: [{
      Authorization: []
    }],
    responses: {
      200: {
        description: "OK",
        content: {
          "application/json": {
            schema: {
              type: "object",
              $ref: "#/components/schemas/ResponseArraySubject",
            },
            examples: {
              subject: {
                $ref: "#/components/examples/ResponseSubjectPagination",
              },
            },
          },
        },
      },
      500: {
        description: "Internal Server Error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                error: {
                  type: "string",
                },
              },
            },
            examples: {
              GenericRoleError: {
                value: {
                  error: 'Internal Server Error'
                }
              },
            },
          },
        },
      },
    },
  },
};
