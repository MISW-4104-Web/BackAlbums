import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collector } from '../collector/collector.entity';
import { Repository } from 'typeorm';
import { Performer } from '../performer/performer.entity';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { PerformerDTO } from '../performer/performer.dto';
import { CollectorDTO } from '../collector/collector.dto';

@Injectable()
export class CollectorPerformerService {
    constructor(
        @InjectRepository(Collector)
        private readonly collectorRepository: Repository<Collector>,
        @InjectRepository(Performer)
        private readonly performerRepository: Repository<Performer>
    ) { }

    async associateCollectorPerformer(collectorId: number, performerId: number): Promise<PerformerDTO> {
        const collector = await this.collectorRepository.findOne({ where: { id: collectorId } });
        if (!collector)
            throw new BusinessLogicException("The collector with the given id was not found", BusinessError.NOT_FOUND)

        const performer = await this.performerRepository.findOne({ where: { id: performerId }, relations: { collectors: true } });
        if (!performer)
            throw new BusinessLogicException("The performer with the given id was not found", BusinessError.NOT_FOUND)

        performer.collectors = [...performer.collectors, collector];

        return await this.performerRepository.save(performer);

    }

    async getPerformersByCollectorId(collectorId: number): Promise<PerformerDTO[]> {
        const collector = await this.collectorRepository.findOne({ where: { id: collectorId }, relations: { favoritePerformers: true } });
        if (!collector)
            throw new BusinessLogicException("The collector with the given id was not found", BusinessError.NOT_FOUND)

        return collector.favoritePerformers;
    }

    async deleteCollectorPerformer(collectorId: number, performerId: number): Promise<CollectorDTO> {
        const collector = await this.collectorRepository.findOne({ where: { id: collectorId }, relations: { favoritePerformers: true } });
        if (!collector)
            throw new BusinessLogicException("The collector with the given id was not found", BusinessError.NOT_FOUND)

        const performer = await this.performerRepository.findOne({ where: { id: performerId } });
        if (!performer)
            throw new BusinessLogicException("The performer with the given id was not found", BusinessError.NOT_FOUND)

        collector.favoritePerformers.filter(e => e.id !== performerId)

        return await this.collectorRepository.save(collector);
    }


}
