import 'dotenv/config';

import app from './app';
import {prisma} from './prisma';

const PORT = process.env.PORT || 8081;

async function main() {
	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
}

main()
	.then(async () => {
		await prisma.$connect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
