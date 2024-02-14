import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {

	const body = await readBody(event);
     let statusCode;

	if (!body.email || !body.username || !body.password) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad request",
			message: "Missing required fields",
		});
	}

     const existingUser = await User.findOne({
          $or: [{ email: body.email }, { username: body.username }]
      });
  
      if (existingUser) {
          throw createError({
              statusCode: 409,
              statusMessage: "User with the provided email or username already exists",
          });
      }

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(body.password, salt);

	const newUser = await User.create({ ...body, password: hashedPassword });
	return { ...newUser.toObject(), password: undefined, statusCode};
});
