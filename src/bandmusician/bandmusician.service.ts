import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Band } from '../band/band.entity';
import { Repository } from 'typeorm';
import { Musician } from '../musician/musician.entity';
import { MusicianDTO } from '../musician/musician.dto';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { BandDTO } from '../band/band.dto';

@Injectable()
export class BandMusicianService {

    constructor(
        @InjectRepository(Band)
        private readonly bandRepository: Repository<Band>,
        @InjectRepository(Musician)
        private readonly musicianRepository: Repository<Musician>
    ) { }

    async addMusicianToBand(bandId: number, musicianId: number): Promise<MusicianDTO> {
        const band = await this.bandRepository.findOne({ where: { id: bandId } });
        if (!band)
            throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)

        const musician = await this.musicianRepository.findOne({ where: { id: musicianId }, relations: { band: true } });
        if (!musician)
            throw new BusinessLogicException("The musician with the given id was not found", BusinessError.NOT_FOUND)

        musician.band = band;

        return await this.musicianRepository.save(musician);
    }

    async findBandByBandIdMusicianId(bandId: number, musicianId: number): Promise<MusicianDTO> {
        const band = await this.bandRepository.findOne({ where: { id: bandId } });
        if (!band)
            throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)

        const musician = await this.musicianRepository.findOne({ where: { id: musicianId }, relations: { band: true } });
        if (!musician)
            throw new BusinessLogicException("The musician with the given id was not found", BusinessError.NOT_FOUND)

        if (musician.band && (musician.band.id === band.id))
            return musician;
        else
            throw new BusinessLogicException("The musician with the given id is not associated to the band", BusinessError.PRECONDITION_FAILED)
    }

    async findMusiciansByBandId(bandId: number): Promise<MusicianDTO[]> {
        const band = await this.bandRepository.findOne({ where: { id: bandId }, relations: { musicians: true } });
        if (!band)
            throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)

        return band.musicians;
    }

    async deleteMusicianToBand(bandId: number, musicianId: number): Promise<BandDTO> {
        const band = await this.bandRepository.findOne({ where: { id: bandId }, relations: { musicians: true } });
        if (!band)
            throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)

        const musician = await this.musicianRepository.findOne({ where: { id: musicianId } });
        if (!musician)
            throw new BusinessLogicException("The musician with the given id was not found", BusinessError.NOT_FOUND)

        band.musicians = band.musicians.filter(e => {
            e.id !== musicianId
        });

        return await this.bandRepository.save(band);
    }

}
