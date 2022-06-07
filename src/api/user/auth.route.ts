/* eslint-disable @typescript-eslint/no-var-requires */
import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {Magic} from '@magic-sdk/admin';
import passport from 'passport';
const MagicStrategy = require('passport-magic').Strategy;

import {User} from './user.model';

const router = express.Router();

const magic = new Magic(process.env.MAGIC_SECRET_KEY!);

const strategy = new MagicStrategy(async function (user: any, done: any) {
	const userMetadata = await magic.users.getMetadataByIssuer(user.issuer);
	console.log('🕵️‍♂️ 🥷🏻 : ==> file: auth.route.ts : ==> line 16 : ==> userMetadata', userMetadata);
	const existingUser = await User.findOne({issuer: user.issuer});
	if (!existingUser) {
		/* Create new user if doesn't exist */
		// return signup(user, userMetadata, done);
	} else {
		/* Login user if otherwise */
		return '';
	}
});

passport.use(strategy);
/*
const signup = async (user, userMetadata, done) => {
	// let newUser = {
	//   issuer: user.issuer,
	//   email: userMetadata.email,
	//   lastLoginAt: user.claim.iat
	// };
	// await users.insert(newUser);
	// return done(null, newUser);
	return '';
}; */

router.post(
	'/api/authenticate',
	[body('email').trim().isEmail().withMessage('Invalid Email')],
	passport.authenticate('magic'),
	async (req: Request, res: Response) => {
		const {email} = req.body;

		res.status(201).json({message: 'Route Active'});
	},
);

export {router as authRouter};
