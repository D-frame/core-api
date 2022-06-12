/* eslint-disable @typescript-eslint/no-explicit-any */
import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {Magic, SDKError} from '@magic-sdk/admin';

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
		const magic = new Magic(process.env.MAGIC_SECRET_KEY);
		const DIDToken = req.headers.authorization.substring(7);
		console.log(DIDToken)
		console.log(process.env.MAGIC_SECRET_KEY)
		try {
			const metadata = await magic.users.getMetadataByToken(DIDToken);
			console.log(metadata)
			const userInfo = await User.where({publicAddress: metadata.publicAddress});
			if(userInfo.length > 0) {
				console.log("User exists")
				res.send(userInfo)
			} else {
				console.log("Creating new user")
				let newUser = {
					email: metadata.email,
					publickey: metadata.publicAddress,
					earnings: "0",
					isActive: true,
					isEmailVerified: true
				};
				try {
					let userNew = await User.create(newUser);
					console.log(userNew)
					res.send(userNew);
				} catch(err) {
					console.log(err)
				}
				
			}		
		} catch(err) {
			if (err instanceof SDKError) {
				console.log(err)
			}
		}
		
		
	}
);

export {router as authRouter};
