import { Injectable } from '@nestjs/common';
import { Musician } from './musician.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MusicianDTO } from './musician.dto';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import * as Joi from 'joi';
import { validate } from "../shared/validation";

@Injectable()
export class MusicianService {
    constructor(
        @InjectRepository(Musician)
        private readonly musicianRepository: Repository<Musician>) { }

    async findAll(): Promise<MusicianDTO[]> {
        return await this.musicianRepository.find({ relations: { albums: true, performerPrizes: true } });
    }

    async findOne(id: number): Promise<MusicianDTO> {
        const musician = await this.musicianRepository.findOne({ where: { id }, relations: { albums: true, performerPrizes: true } });
        if (!musician)
            throw new BusinessLogicException("The musician with the given id was not found", BusinessError.NOT_FOUND)
        return musician;
    }

    async create(musicianDTO: MusicianDTO): Promise<MusicianDTO> {
        const { error } = validate(this.schema, musicianDTO);
        if(error){
            throw new BusinessLogicException(error.toString(), BusinessError.BAD_REQUEST);
        } else {
            const musician = new Musician();
            musician.name = musicianDTO.name;
            musician.image = musicianDTO.image;
            musician.description = musicianDTO.description;
            musician.birthDate = musicianDTO.birthDate;
            return await this.musicianRepository.save(musician);
        }
    }

    async update(id: number, musicianDTO: MusicianDTO): Promise<MusicianDTO> {

        const musician = await this.musicianRepository.findOneBy({id: id});;
        if (!musician)
            throw new BusinessLogicException("The musician with the given id was not found", BusinessError.NOT_FOUND)
        else {
            const { error } = validate(this.schema, musicianDTO);
            if(error){
                throw new BusinessLogicException(error.toString(), BusinessError.BAD_REQUEST);
            } else {
                musician.name = musicianDTO.name;
                musician.image = musicianDTO.image;
                musician.description = musicianDTO.description;
                musician.birthDate = musicianDTO.birthDate;
                await this.musicianRepository.save(musician);
                return musician;
            }
        }
    }

    async delete(id: number) {
        const musician = await this.musicianRepository.findOneBy({id: id});;
        if (!musician)
            throw new BusinessLogicException("The musician with the given id was not found", BusinessError.NOT_FOUND)
        return await this.musicianRepository.remove(musician);
    }

    schema = Joi.object({
        name: Joi.string().required(),  
        image: Joi.string().uri(), 
        description: Joi.string().required(),  
        birthDate: Joi.date()
    })
}
