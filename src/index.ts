import {PrismaClient} from '@prisma/client';
import express from 'express';
import router from './routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

const PORT = process.env.PORT || 8080;

export const prisma = new PrismaClient();

app.use(cors({origin: 'http://localhost:3000', credentials: true}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);
app.get('/', (_, res) => {
    res.status(200).json({message: 'Hello World'});
});
app.all('*', (_, res) => {
    res.status(404).json({message: 'Not found'});
});

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

export default app;
