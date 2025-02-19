import {Request, Response} from 'express';
import {Section} from '@prisma/client';
import sectionsService from '../services/sections.service';

class SectcionsController {
    async createSections(req: Request<{}, {}, {sections: Section[]}>, res: Response) {
        try {
            const sections = await sectionsService.createSection(req.body);
            res.json(sections);
        } catch (error) {
            res.status(500).json({
                error: `Failed to create sections: ${(error as Error).message}`,
            });
        }
    }

    async getSectionsByDiscussionId(
        req: Request<{discussionId: Section['discussionId']}>,
        res: Response,
    ) {
        try {
            const {discussionId} = req.params;
            const sections = await sectionsService.getSections(discussionId);
            res.json(sections);
        } catch (error) {
            res.status(500).json({error: `Failed to get sections: ${(error as Error).message}`});
        }
    }

    async deleteSection(req: Request<{sectionId: Section['id']}>, res: Response) {
        try {
            const {sectionId} = req.params;
            const section = await sectionsService.deleteSection(sectionId);
            res.json(section);
        } catch (error) {
            res.status(500).json({
                error: `Failed to delete section: ${(error as Error).message}`,
            });
        }
    }
}

export default new SectcionsController();
