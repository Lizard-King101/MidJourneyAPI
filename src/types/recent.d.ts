import { Image } from "src/modules/noco";

interface Recent {
    Id: number;
    Prompt: string;
    CreatedAt: Date;
    UpdatedAt: Date;
    Image?: Array<Image>;
    Status: 'Published' | 'Un Published';
}