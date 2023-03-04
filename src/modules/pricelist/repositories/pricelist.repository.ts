import { BaseRepository } from "@src/database/base-repository.js";
import DatabaseConnection, {
  DocumentInterface,
  CreateOptionsInterface,
  CreateResultInterface,
  ReadOptionsInterface,
  ReadResultInterface,
  QueryInterface,
  ReadManyOptionsInterface,
  ReadManyResultInterface,
  UpdateOptionsInterface,
  UpdateResultInterface,
  DeleteOptionsInterface,
  DeleteResultInterface,
} from "@src/database/connection";

export class PricelistRepository extends BaseRepository {
  constructor(db: DatabaseConnection) {
    super(db, "pricelist");
  }

  public async create(doc: DocumentInterface, options?: CreateOptionsInterface): Promise<CreateResultInterface> {
    return await this.collection().create(doc, options);
  }

  public async read(id: string, options?: ReadOptionsInterface): Promise<ReadResultInterface> {
    return await this.collection().read(id, options);
  }

  public async readMany(
    query: QueryInterface,
    options?: ReadManyOptionsInterface | undefined
  ): Promise<ReadManyResultInterface> {
    throw await this.collection().readMany(query, options);
  }

  public async update(
    id: string,
    document: DocumentInterface,
    options?: UpdateOptionsInterface
  ): Promise<UpdateResultInterface> {
    return await this.collection().update(id, document, options);
  }

  public async delete(id: string, options?: DeleteOptionsInterface | undefined): Promise<DeleteResultInterface> {
    throw await this.collection().delete(id, options);
  }
  public async aggregate(pipeline: any, query: any) {
    return await this.collection().aggregate(pipeline, query);
  }
}
