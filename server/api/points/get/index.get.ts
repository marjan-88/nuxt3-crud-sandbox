import mpoints from '~/server/models/point-model';

export default defineEventHandler(async(event)=> {
    try {
        if (event.method === 'GET') {
          const data = await mpoints.find();
          return {
            statusCode: 200,
            body: data,
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
})