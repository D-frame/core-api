/* eslint-disable @typescript-eslint/no-explicit-any */
import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {Magic} from '@magic-sdk/admin';
import passport from 'passport';
import {Strategy as MagicStrategy} from 'passport-magic';

import {User} from './user.model';

const router = express.Router();

const magic = new Magic(process.env.MAGIC_SECRET_KEY);

const strategy = new MagicStrategy(async function (user: any, done: any) {
	const userMetadata = await magic.users.getMetadataByIssuer(user.issuer);
	console.log('🕵️‍♂️ 🥷🏻 : ==> file: auth.route.ts : ==> line 16 : ==> userMetadata', userMetadata);
	const existingUser = await User.findOne({issuer: user.issuer});
	if (!existingUser) {
		/* Create new user if doesn't exist */
		return signup(user, userMetadata, done);
	} else {
		/* Login user if otherwise */
		return login();
	}
});

passport.use(strategy);
const signup = async (user: any, userMetadata: any, done: any) => {
	// 	// let newUser = {
	// 	//   issuer: user.issuer,
	// 	//   email: userMetadata.email,
	// 	//   lastLoginAt: user.claim.iat
	// 	// };
	// 	// await users.insert(newUser);
	// 	// return done(null, newUser);
	return '';
};

const login = () => {
	return 'Logged In';
};

router.post(
	'/api/login',
	body('email').trim().isEmail().withMessage('Please provide correct email'),
	passport.authenticate('magic'),
);

export {router as authRouter};
