export interface ImageInfo {
    character: string;
    original: string;
    date: string;
    key: string;
    selling_point: string;
    like: {
        count: number;
        users: {
            [index: string]: boolean;
        };
    };
    timestamp: number;
}
