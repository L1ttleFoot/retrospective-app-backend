import { Request, Response} from "express";

class TestController {
    async test(req: Request, res: Response) {
        try {
            res.json({"message": "Hello from test controller"});
        } catch (error) {
            res.status(500).json({
                error: `Failed to create sections: ${(error as Error).message}`,
            });
        }
    }
}


export default new TestController();