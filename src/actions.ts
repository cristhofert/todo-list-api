import { Request, Response } from 'express'
import { getRepository } from 'typeorm'  // getRepository"  traer una tabla de la base de datos asociada al objeto
import { User } from './entities/User'
import { Exception } from './utils'
import { Note } from './entities/Note'

export const createUser = async (req: Request, res:Response): Promise<Response> =>{

	// important validations to avoid ambiguos errors, the client needs to understand what went wrong
	if(!req.body.username) throw new Exception("Please provide a username")

	const userRepo = getRepository(User)
	// fetch for any user with this email
	const user = await userRepo.findOne({ where: {username: req.body.username }})
	if(user) throw new Exception("User already exists with this email")

	const newUser = getRepository(User).create(req.body);  //Creo un usuario
	const results = await getRepository(User).save(newUser); //Grabo el nuevo usuario 
	return res.json(results);
}

export const getUsers = async (req: Request, res: Response): Promise<Response> =>{
		const users = await getRepository(User).find({ relations: ["list"] });
		return res.json(users);
}


export const getList = async (req: Request, res: Response): Promise<Response> =>{
    const userRepo = getRepository(User)
	const user = await userRepo.findOne({ where: {id: req.params.id }, relations: ["list"] })
	if(!user) throw new Exception("User don't exists ")
    
    return res.json(user);
}


export const createNote = async (req: Request, res:Response): Promise<Response> =>{

	// important validations to avoid ambiguos errors, the client needs to understand what went wrong
	if(!req.body.message) throw new Exception("Please provide a message")

	const userRepo = getRepository(User)
	// fetch for any user with this email
	const user = await userRepo.findOne({ where: {id: req.params.id }})
    if(!user) throw new Exception("User don't exists ")
    
    let note = new Note()
    note.label = req.body.message;
    note.done = false;
    note.user = user;
    const results = await getRepository(Note).save(note);

	return res.json(results);
}

export const deleteNote = async (req: Request, res:Response): Promise<Response> =>{

	const userRepo = getRepository(User)
	// fetch for any user with this email
	const user = await userRepo.findOne({ where: {id: req.params.id }})
    if(!user) throw new Exception("User don't exists ")
    
    if(user.list) user.list = []
    const results = await getRepository(User).save(user);

	return res.json(results);
}