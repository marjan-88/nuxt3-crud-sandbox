import mpoints from "~/server/models/point-model";

export default defineEventHandler(async (event) => {
	try {
		if (event.method === "DELETE") {
			// Get the resource identifier from the URL parameters
			const resourceId = getRouterParam(event, "_id");

			console.log(
				"Received DELETE request for resource with _id:",
				resourceId
			);

			if (!resourceId) {
				return {
					statusCode: 400,
					body: JSON.stringify({
						error: "Bad Request: Missing resource identifier in the URL parameters",
					}),
				};
			}

			// Check if there are at least X objects before allowing deletion
			const count = await mpoints.countDocuments();

			const minimumObjectsRequired = 2; // Replace X with the desired minimum count

			if (count < minimumObjectsRequired) {
				return {
					statusCode: 403,
					body: JSON.stringify({
						error: "Forbidden: Deletion not allowed due to insufficient objects",
					}),
				};
			}

			// Find the resource by its identifier and delete it from the database
			console.log("Deleting resource with _id:", resourceId);
			const deletedData = await mpoints.findByIdAndDelete(resourceId);

			if (!deletedData) {
				return {
					statusCode: 404,
					body: JSON.stringify({
						error: "Not Found: Resource not found",
					}),
				};
			}

			return {
				statusCode: 200,
				body: JSON.stringify({
					message: `Resource with _id ${resourceId} deleted successfully`,
				}),
			};
		} else {
			return {
				statusCode: 405,
				body: JSON.stringify({ error: "Method Not Allowed" }),
			};
		}
	} catch (error) {
		console.error(error);
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Internal Server Error" }),
		};
	}
});
