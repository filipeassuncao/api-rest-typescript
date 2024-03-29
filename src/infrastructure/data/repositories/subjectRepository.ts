import { inject, injectable } from "tsyringe";
import { EntityManager, Repository } from "typeorm";
import SubjectRepositoryInterface from "../../../domain/interfaces/repositories/subjectRepositoryInterface";
import subjectInterface from "../../../domain/interfaces/entities/subject";
import { Subject } from "../../../domain/entities/subject";
import SubjectInterface from "../../../domain/interfaces/entities/subject";

@injectable()
export default class SubjectRepository
  implements SubjectRepositoryInterface
{
  private subjectRepository: Repository<subjectInterface>;

  constructor(
    @inject("EntityManager")
    private readonly entityManager: EntityManager
  ) {
    this.subjectRepository = this.entityManager.getRepository(Subject);
  }

  find = async (
    limit: number,
    offset: number
  ): Promise<[SubjectInterface[], number]> => {
    return this.subjectRepository.findAndCount({
      skip: offset,
      take: limit,
    });
  };

  save = async (subject: Subject): Promise<subjectInterface> => {
    return this.subjectRepository.save(subject);
  };

  findOneById = async (id: string): Promise<SubjectInterface | null> => {
    return this.subjectRepository.findOneOrFail({
      where: {
        id: id,
      },
    });
  };

  delete = async (id: string): Promise<void> => {
    const subject = await this.findOneById(id);
    await this.subjectRepository.softRemove(subject!);
  }
}
