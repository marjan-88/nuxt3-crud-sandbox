import mongoose from "mongoose";
export interface MapPoint {
	_id?: mongoose.Types.ObjectId;
	name: string;
	category?: string | {}[];
	lat: number;
	lng: number;
	img: string;
	url: string;
	content: string;
	rating?: number;
	isFavorite?: boolean;
	createdAt?: Date; 
	updatedAt?: Date; 
}
