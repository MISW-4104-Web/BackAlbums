import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { Collector } from './collector.entity';
import { CollectorDTO } from './collector.dto';
import * as Joi from "joi";
import { validate } from "../shared/validation";

@Injectable()
export class CollectorService {
    constructor(
        @InjectRepository(Collector)
        private readonly collectorRepository: Repository<Collector>,
    ) { }

    async findAll(): Promise<CollectorDTO[]> {
        return await this.collectorRepository.find({ relations: { comments: true, favoritePerformers: true, collectorAlbums: true } });
    }

    async findOne(id: number): Promise<CollectorDTO> {
        const collector = await this.collectorRepository.findOne({ where: { id }, relations: { comments: true, favoritePerformers: true, collectorAlbums: true } });
        if (!collector)
            throw new BusinessLogicException("The collector with the given id was not found", BusinessError.NOT_FOUND)
        return collector;
    }

    async create(collectorDTO: CollectorDTO): Promise<CollectorDTO> {
        const { error } = validate(this.schema, collectorDTO);
        if(error)
            throw new BusinessLogicException(error.toString(), BusinessError.BAD_REQUEST)
        else {
            const collector = new Collector();
            collector.name = collectorDTO.name;
            collector.telephone = collectorDTO.telephone;
            collector.email = collectorDTO.email;
            return await this.collectorRepository.save(collector);
        }
    }

    async update(id: number, collectorDTO: CollectorDTO) {

        const collector = await this.collectorRepository.findOneBy({id: id});;
        if (!collector)
            throw new BusinessLogicException("The collector with the given id was not found", BusinessError.NOT_FOUND)
        else {
            const { error } = validate(this.schema, collectorDTO);
            
            if(error)
                throw new BusinessLogicException(error.toString(), BusinessError.BAD_REQUEST)
            else {
                collector.name = collectorDTO.name;
                collector.telephone = collectorDTO.telephone;
                collector.email = collectorDTO.email;
                await this.collectorRepository.save(collector);
                return collector;
            }   
        }
    }

    async delete(id: number) {
        const collector = await this.collectorRepository.findOneBy({id: id});;
        if (!collector)
            throw new BusinessLogicException("The collector with the given id was not found", BusinessError.NOT_FOUND)
        return await this.collectorRepository.remove(collector);
    }

    schema = Joi.object({
        name: Joi.string().required(),
        telephone: Joi.string().required(),
        email: Joi.string().email().required()
    });

}
