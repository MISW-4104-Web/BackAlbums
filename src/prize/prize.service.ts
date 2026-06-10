import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Prize } from './prize.entity';
import { PrizeDTO } from './prize.dto';

import { BusinessLogicException, BusinessError } from "../shared/errors/business-errors";

import * as Joi from "joi";
import { validate } from "../shared/validation";

@Injectable()
export class PrizeService {
    constructor(
        @InjectRepository(Prize)
        private readonly prizeRepository: Repository<Prize>) { }

    async findAll(): Promise<PrizeDTO[]> {
        return await this.prizeRepository.find({ relations: { performerPrizes: true } });
    }

    async findOne(id: number): Promise<PrizeDTO> {
        const prize = await this.prizeRepository.findOne({ where: { id }, relations: { performerPrizes: true } });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND)

        return prize;
    }

    async create(prizeDTO: PrizeDTO): Promise<PrizeDTO> {
        const { error } = validate(this.schema, prizeDTO);
        if(error){
            throw new BusinessLogicException(error.toString(), BusinessError.BAD_REQUEST) 
        } else {
            let newPrize = new Prize();
            newPrize.name = prizeDTO.name;
            newPrize.description = prizeDTO.description
            newPrize.organization = prizeDTO.organization;

            return await this.prizeRepository.save(newPrize)
        }
    }

    async update(id: number, prizeDTO: PrizeDTO): Promise<PrizeDTO> {
        const prize = await this.prizeRepository.findOneBy({id: id});;
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND)

        const { error } = validate(this.schema, prizeDTO);
        if(error){
            throw new BusinessLogicException(error.toString(), BusinessError.BAD_REQUEST) 
        } else {
            prize.name = prizeDTO.name;
            prize.description = prizeDTO.description;
            prize.organization = prizeDTO.organization;

            return await this.prizeRepository.save(prize);
        }
    }

    async delete(id: number) {
        const prize = await this.prizeRepository.findOneBy({id: id});;

        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND)

        return await this.prizeRepository.remove(prize);
    }

    schema = Joi.object({
        name: Joi.string().required(),
	    description: Joi.string().required(),
	    organization: Joi.string().required(),
    });
}
