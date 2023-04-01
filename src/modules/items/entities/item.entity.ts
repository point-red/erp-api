/* eslint-disable prettier/prettier */
import { ObjectId } from "mongodb";

export interface ItemInterface {
	_id?: string | ObjectId;
	name?: string;
	chartOfAccount?: string;
	hasProductionNumber?: boolean;
	hasExpiryDate?: boolean;
	unit?: number;
	converter?: {
		name?: string;
		multiply?: number;
	};
}

export class ItemEntity {
	public item: ItemInterface;

	constructor(item: ItemInterface) {
		this.item = item;
	}
}
