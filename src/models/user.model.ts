import mongoose from 'mongoose';

interface UserAttrs {
	firstName: string;
	lastName: string;
	isActive: boolean;
	isEmailVerified: boolean;
	email: string;
	publicKey: string;
	earnings: string;
}

interface UserDoc extends mongoose.Document {
	firstName: string;
	lastName: string;
	isActive: boolean;
	isEmailVerified: boolean;
	email: string;
	publicKey: string;
	earnings: string;
}

interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}
const userSchema = new mongoose.Schema(
	{
		firstName: {type: String},
		lastName: {type: String},
		email: {type: String},
		isActive: {type: Boolean, required: true},
		isEmailVerified: {type: Boolean, default: false},
		publickey: {type: String,required: true, unique: true},
		earnings: {type: String, required: true},
	},
	{
		timestamps: true,
		toJSON: {
			transform(doc, ret) {
				/*
                    '_id' is transformed to 'id' as later people can use different databases and different languages as part of microservices architecture so 'id' is more standard key in databases, only mongodb uses '_id'
                */
				ret.id = ret._id;
				delete ret._id;
				delete ret.__v;
			},
		},
	},
);

userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export {User};
