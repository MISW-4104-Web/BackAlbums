import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Prize } from '../prize/prize.entity';
import { Repository } from 'typeorm';
import { Performer } from '../performer/performer.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { PerformerPrizeDTO } from './performerprize.dto';
import { PerformerPrize } from './performerprize.entity';
import * as Joi from "joi";
import { validate } from "../shared/validation";

@Injectable()
export class PerformerPrizeService {

    constructor(
        @InjectRepository(Prize)
        private readonly prizeRepository: Repository<Prize>,
        @InjectRepository(Performer)
        private readonly performerRepository: Repository<Performer>,
        @InjectRepository(PerformerPrize)
        private readonly performerPrizeRepository: Repository<PerformerPrize>,
    ) { }

    async findPerformerPrize(prizeId: number) {
        const prize = await this.prizeRepository.findOne({ where: { id: prizeId } });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND)

        const performerPrize = await this.performerPrizeRepository.find({ relations: { performer: true, prize: true } })
        
        return performerPrize.filter(p => p.prize.id == prizeId)
    }

    async associatePerformerPrize(prizeId: number, performerId: number, performerPrizeDTO: PerformerPrizeDTO) {
        const prize = await this.prizeRepository.findOne({ where: { id: prizeId } });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND)

        const performer = await this.performerRepository.findOne({ where: { id: performerId } });
        if (!performer)
            throw new BusinessLogicException("The performer with the given id was not found", BusinessError.NOT_FOUND)

        const { error } = validate(this.schema, performerPrizeDTO);
        if(error){
            throw new BusinessLogicException(error.toString(), BusinessError.BAD_REQUEST)
        } else {
            const performerPrize = new PerformerPrize();
            performerPrize.premiationDate = performerPrizeDTO.premiationDate;
            performerPrize.prize = prize;
            performerPrize.performer = performer;

            return await this.performerPrizeRepository.save(performerPrize);
        }
    }

    async deletePrizePerformer(prizeId: number, performerId: number) {

        const prize = await this.prizeRepository.findOne({ where: { id: prizeId } });
        if (!prize)
            throw new BusinessLogicException("The prize with the given id was not found", BusinessError.NOT_FOUND)

        const performer = await this.performerRepository.findOne({ where: { id: performerId } });
        if (!performer)
            throw new BusinessLogicException("The performer with the given id was not found", BusinessError.NOT_FOUND)

        const performerprize = await this.performerPrizeRepository.findOne({ where: { prize: { id: prizeId }, performer: { id: performerId } }, relations: { performer: true } });

        if (!performerprize)
            throw new BusinessLogicException("The prize is not associated to the performer", BusinessError.NOT_FOUND)

        return await this.performerPrizeRepository.remove(performerprize);

    }

    async findAll(): Promise<PerformerPrizeDTO[]> {
        return await this.performerPrizeRepository.find({ relations: { prize: true } });
    }

    schema = Joi.object({ 
        premiationDate: Joi.date()
    })

}
