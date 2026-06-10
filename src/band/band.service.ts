import { Injectable } from '@nestjs/common';
import { Band } from './band.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BandDTO } from './band.dto';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { Musician } from '../musician/musician.entity';
import * as Joi from "joi";
import { validate } from "../shared/validation"

@Injectable()
export class BandService {
    constructor(
        @InjectRepository(Band)
        private readonly bandRepository: Repository<Band>,
        @InjectRepository(Musician)
        private readonly musicianRepository: Repository<Musician>
    ) { }

    async findAll(): Promise<BandDTO[]> {
        return await this.bandRepository.find({ relations: { albums: true, musicians: true, performerPrizes: true } });
    }

    async findOne(id: number): Promise<BandDTO> {
        const band = await this.bandRepository.findOne({ where: { id }, relations: { albums: true, musicians: true, performerPrizes: true } });
        if (!band)
            throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)
        return band;
    }

    async create(bandDTO: BandDTO): Promise<BandDTO> {
        const { error } = validate(this.schema, bandDTO);

        if(error) {
            throw new BusinessLogicException(error.toString(), BusinessError.BAD_REQUEST)    
        } else {
            const band = new Band();
            band.name = bandDTO.name;
            band.image = bandDTO.image;
            band.description = bandDTO.description;
            band.creationDate = bandDTO.creationDate;
            return await this.bandRepository.save(band);
        }
    }

    async update(id: number, bandDTO: BandDTO): Promise<BandDTO> {

        const band = await this.bandRepository.findOneBy({id: id});;
        if (!band)
            throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)
        else {
            const { error } = validate(this.schema, bandDTO);
            if(error){
                throw new BusinessLogicException(error.toString(), BusinessError.BAD_REQUEST)
            } else {
                band.name = bandDTO.name;
                band.image = bandDTO.image;
                band.description = bandDTO.description;
                band.creationDate = bandDTO.creationDate;
                await this.bandRepository.save(band);
                return band;
            }
        }
    }

    async delete(id: number) {
        const band = await this.bandRepository.findOneBy({id: id});;
        if (!band)
            throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)
        return await this.bandRepository.remove(band);
    }

    schema = Joi.object({
        name: Joi.string().required(),  
        image: Joi.string().uri(),  
        description: Joi.string().required(),  
        creationDate:Joi.date().required(),
    })
}
