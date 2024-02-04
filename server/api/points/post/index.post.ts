import mpoints from '~/server/models/point-model';

export default defineEventHandler(async (event) => {
  try {
    if (event.method === 'POST') {
      const body = await readBody(event);

      // Create a new instance of the mpoints model without providing _id
      const newData = new mpoints(body);

      // Save the new data to the database
      await newData.save();

      return {
        statusCode: 201, // 201 Created
        body: JSON.stringify({ message: 'Resource created successfully', data: newData }),
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
