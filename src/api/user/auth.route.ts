/* eslint-disable @typescript-eslint/no-explicit-any */
import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {Magic} from '@magic-sdk/admin';

import {User} from '../../models/user.model';

const router = express.Router();

const magic = new Magic(process.env.MAGIC_SECRET_KEY);


// const signup = async (user: any, userMetadata: any, done: any) => {
// 	let newUser = {
// 		issuer: user.issuer,
// 		email: userMetadata.email,
// 		lastLoginAt: user.claim.iat
// 	};
// 	await user.insert(newUser);
// 	return done(null, newUser);
// 	return '';
// };

// const login = async (user: any, done: any) => {
// 	/* Replay attack protection (https://go.magic.link/replay-attack) */
// 	if (user.claim.iat <= user.lastLoginAt) {
// 	  return done(null, false, {
// 		message: `Replay attack detected for user ${user.issuer}}.`
// 	  });
// 	}
// 	await User.update(
// 	  { issuer: user.issuer },
// 	  { $set: { lastLoginAt: user.claim.iat } }
// 	);
// 	return done(null, user);
// };



router.get(
	'/api/login', async (req: any, res: any) => {
		/*
		  Assumes DIDToken was passed in the Authorization header
		  in the standard `Bearer {token}` format.
		 */
		const DIDToken = req.headers.authorization.substring(7);
		const metadata = await magic.users.getMetadataByToken(DIDToken);
		const userInfo = User.where({publicAddress: metadata.publicAddress});
		if(userInfo) {
			res.send(userInfo)
		} else {
			let newUser = {
				email: metadata.email,
				publicAddress: metadata.publicAddress,
				earnings: "0",
				isActive: true,
				isEmailVerified: true
			};
			let userNew = await User.create(newUser);
			res.send(userNew);
		}		
	}
);

export {router as authRouter};
