import { inject, injectable } from "tsyringe";
import { Request, Response } from "express";
import Logger from "../../infrastructure/data/log/logger";
import { validationResult } from "express-validator";
import SubjectService from "../../application/services/subjectService";
import { Subject } from "../../domain/entities/subject";
import {
  created,
  noContent,
  notFound,
  ok,
  serverError,
  unprocessableEntity,
} from "../helpers/httpHelper";
import { EntityNotFoundError } from "typeorm";

@injectable()
export default class SubjectController {
  constructor(
    @inject(SubjectService)
    public readonly subjectService: SubjectService
  ) {}

  save = async (request: Request, response: Response): Promise<Response> => {
    try {
      Logger.debug(
        `subjectController - save - body params: ${JSON.stringify(
          request.body
        )}`
      );
      const schemaErrors = validationResult(request);
      if (!schemaErrors.isEmpty()) {
        return unprocessableEntity(response, schemaErrors);
      }
      Logger.debug("subjectController - save - SubjectService");
      const subject = new Subject(request.body);
      const result = await this.subjectService.save(subject);
      return created(response, { data: result });
    } catch (error) {
      Logger.error(`subjectController - save - error: ${error}`);
      return serverError(response);
    }
  };

  find = async (request: Request, response: Response): Promise<Response> => {
    try {
      Logger.debug(
        `subjectController - find - query params: ${JSON.stringify(
          request.query
        )}`
      );
      const limit = Number(request.query.limit) || 20;
      const offset = Number(request.query.offset) || 0;
      const result = await this.subjectService.find(limit, offset);

      return ok(response, {
        data: result.subjects,
        pagination: result.pagination,
      });
    } catch (error) {
      Logger.error(`subjectController - get - error: ${error}`);
      return serverError(response);
    }
  };

  update = async (request: Request, response: Response): Promise<Response> => {
    try {
      Logger.debug(
        `subjectController - update - body params: ${JSON.stringify(
          request.body
        )}`
      );
      const schemaErrors = validationResult(request);
      if (!schemaErrors.isEmpty()) {
        return unprocessableEntity(response, schemaErrors);
      }

      Logger.debug("subjectController - subjectService - update");
      const result = await this.subjectService.update(request);

      return ok(response, result);
    } catch (error) {
      Logger.error(`subjectController - save - error: ${error}`);
      if (error instanceof EntityNotFoundError) {
        return notFound(response, "Subject not found");
      }
      return serverError(response);
    }
  };

  delete = async (request: Request, response: Response): Promise<Response> => {
    try {
      Logger.debug(
        `subjectController - delete - id: ${JSON.stringify(
          request.params.id
        )}`
      );
      const schemaErrors = validationResult(request);
      if (!schemaErrors.isEmpty()) {
        return unprocessableEntity(response, schemaErrors);
      }
      Logger.debug("subjectService - courseController - delete");
      await this.subjectService.delete(request.params.id);

      return noContent(response);
    } catch (error) {
      Logger.error(`subjectController - delete - error: ${error}`);
      if (error instanceof EntityNotFoundError) {
        return notFound(response, "Subject not found");
      }
      return serverError(response);
    }
  };
}
