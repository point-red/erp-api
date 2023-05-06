/* eslint-disable prettier/prettier */
import { ItemEntity, ItemInterface } from "../entities/item.entity";
import { ItemRepository } from "../repositories/item.repository";
import DatabaseConnection from "@src/database/connection.js";

export class ReadItemService {
	private db: DatabaseConnection;
	constructor(db: DatabaseConnection) {
		this.db = db;
	}
	public async handle(id: string) {
		const itemRepository = new ItemRepository(this.db);
		const result = (await itemRepository.read(id)) as unknown as ItemInterface;

		const item: ItemInterface = {
			_id: result._id as string,
			name: result.name as string,
			chartOfAccount: result.chartOfAccount as string,
			hasExpiryDate: result.hasExpiryDate as boolean,
			unit: result.unit as number,
			converter: result.converter as unknown as ItemInterface,
		};
		const itemEntity = new ItemEntity(item);

		return itemEntity.item;
	}
}
