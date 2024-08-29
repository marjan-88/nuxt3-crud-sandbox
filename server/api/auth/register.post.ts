import bcrypt from "bcrypt";
// import { google } from 'googleapis';
export default defineEventHandler(async (event) => {

	// const body = await readBody(event);

	const { name, email, password } = await readBody(event);

	let statusCode;	

	if (!email || !name || !password) {
		throw createError({
			statusCode: 400,
			statusMessage: "Bad request",
			message: "Missing required fields",
		});
	}
     const existingUser = await User.findOne({
          $or: [{ email: email }]
      });
  
      if (existingUser) {
          throw createError({
              statusCode: 409,
              statusMessage: "User with the provided email already exists",
          });
      }

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const newUser = await User.create({ name, email, password: hashedPassword });
	
	return { ...newUser.toObject(), password: undefined, statusCode};
});
