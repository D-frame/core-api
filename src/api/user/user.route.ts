import express, {Request, Response} from 'express';
import {User} from '../../models/user.model';

const router = express.Router();
import {Magic, SDKError} from '@magic-sdk/admin';

router.get('/api/user/update-email', async (req: Request, res: Response) => {
    let email = req.query.email
    const magic = new Magic(process.env.MAGIC_SECRET_KEY);
	if (req.headers && req.headers.authorization) {
		const DIDToken = req.headers.authorization.substring(7);
		try {
			const metadata = await magic.users.getMetadataByToken(DIDToken);
			console.log(metadata);
			let user = await User.updateOne({publicKey: String(metadata.publicAddress)}, {email: String(email)})
            res.send(user)
		} catch (err) {
			if (err instanceof SDKError) {
				console.log(err);
			}
		}
	} else {
        res.status(404).send("User not found")
    }
});

export{router as userRouter}