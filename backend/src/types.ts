import {EntityManager} from "@mikro-orm/core";
import {Request, Response} from "express";

export type MyContext = {
    em: EntityManager<any> & EntityManager;
    req: Request & { session: Express.Session};
    res: Response;
}