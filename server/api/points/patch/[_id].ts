import mpoints from '~/server/models/point-model';

export default defineEventHandler(async (event) => {
  try {
    if (event.method === 'PATCH') {
      const body = await readBody(event);

      const resourceId = getRouterParam(event, "_id");      

      // Check if id is provided
      if (!resourceId) {
        return {
          statusCode: 400, // 400 Bad Request
          body: JSON.stringify({ error: 'ID is required for PATCH request' }),
        };
      }

      // Find the existing resource by id
      const existingData = await mpoints.findById(resourceId);

      // Check if the resource exists
      if (!existingData) {
        return {
          statusCode: 404, // 404 Not Found
          body: JSON.stringify({ error: 'Resource not found' }),
        };
      }

      // Update the existing resource with the provided data
      Object.assign(existingData, body);

      // Save the updated data to the database
      await existingData.save();

      return {
        statusCode: 200, // 200 OK
        body: JSON.stringify({ message: 'Resource updated successfully', data: existingData }),
      };
    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method Not Allowed' }),
      };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
});
