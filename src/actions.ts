import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { User } from './entities/User'
import { Exception } from './utils'
import { Note } from './entities/Note'

export const createUser = async (req: Request, res: Response): Promise<Response> => {

    // important validations to avoid ambiguos errors, the client needs to understand what went wrong
    if (!req.body.username) throw new Exception("Please provide a username")

    const userRepo = getRepository(User)
    // fetch for any user with this email
    const user = await userRepo.findOne({ where: { username: req.body.username } })
    if (user) throw new Exception("User already exists with this email")

    const newUser = getRepository(User).create(req.body);  //Creo un usuario
    const results = await getRepository(User).save(newUser); //Grabo el nuevo usuario 
    return res.json(results);
}

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
    const users = await getRepository(User).find();//{ relations: ["list"] }
    return res.json(users);
}


export const getTasks = async (req: Request, res: Response): Promise<Response> => {
    const results = await getRepository(Note).find({ where: { user: req.params.id } })
    if (!results) throw new Exception("Tasks don't exists for it user")

    return res.json(results);
}


export const createTask = async (req: Request, res: Response): Promise<Response> => {

    // important validations to avoid ambiguos errors, the client needs to understand what went wrong
    if (!req.body.message) throw new Exception("Please provide a message")

    const userRepo = getRepository(User)
    // fetch for any user with this email
    const user = await userRepo.findOne({ where: { id: req.params.id } })
    if (!user) throw new Exception("User don't exists ")

    let note = new Note()
    note.label = req.body.message;
    note.done = false;
    note.user = user;
    const results = await getRepository(Note).save(note);

    return res.json(results);
}

export const deleteTask = async (req: Request, res: Response): Promise<Response> => {
    const noteRepo = await getRepository(Note)
    const results = noteRepo.findOne({ where: { user: req.params.id } })
    if (!results) throw new Exception("Tasks ID don't exists ")
    noteRepo.delete(req.params.id)

    return res.json(results);

}


export const updateTask = async (req: Request, res: Response): Promise<Response> => {

    if (!req.body.label) throw new Exception("Please provide a label")
    if (!req.body.done) throw new Exception("Please provide a done")

    const note = await getRepository(Note).findOne({ where: { id: req.params.id } })
    if (!note) throw new Exception("Task don't exists ")
    note.label = req.body.label;
    note.done = req.body.done;
    const results = await getRepository(Note).save(note);


    return res.json(results);
}