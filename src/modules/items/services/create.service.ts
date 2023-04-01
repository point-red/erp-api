/* eslint-disable prettier/prettier */
import { ItemEntity } from "../entities/item.entity";
import { ItemRepository } from "../repositories/item.repository";
import DatabaseConnection, { DocumentInterface } from "@src/database/connection.js";

export class CreateItemService {
	private db: DatabaseConnection;
	constructor(db: DatabaseConnection) {
		this.db = db;
	}
	public async handle(doc: DocumentInterface, session: unknown) {
		const itemEntity = new ItemEntity({
			name: doc.name,
			chartOfAccount: doc.chartOfAccount,
			hasProductionNumber: doc.hasProductionNumber,
			hasExpiryDate: doc.hasExpiryDate,
			unit: doc.unit,
			converter: doc.converter,
		});

		const itemRepository = new ItemRepository(this.db);
		return await itemRepository.create(itemEntity.item, { session });
	}
}
