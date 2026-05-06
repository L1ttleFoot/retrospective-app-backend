import {Role, User} from '@/generated/prisma/client';

declare global {
	namespace Express {
		export interface Request {
			user?: {id: User['id']; roles: Role['value'][]};
			guestId?: string;
		}
	}
}
