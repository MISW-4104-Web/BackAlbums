import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException, BusinessError } from "../shared/errors/business-errors";
import { Repository } from 'typeorm';
import { Band } from '../band/band.entity';
import { Album } from '../album/album.entity';
import { AlbumDTO } from '../album/album.dto';
import { BandDTO } from '../band/band.dto';
import { PerformerDTO } from '../performer/performer.dto';

@Injectable()
export class AlbumBandService {
    constructor(
        @InjectRepository(Band)
        private readonly bandRepository: Repository<Band>,

        @InjectRepository(Album)
        private readonly albumRepository: Repository<Album>) { }

    async addAlbumBand(bandId: number, albumId: number): Promise<AlbumDTO> {
        const band = await this.bandRepository.findOne({ where: { id: bandId } });
        if (!band)
            throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)

        const album = await this.albumRepository.findOne({ where: { id: albumId }, relations: { performers: true } });
        if (!album)
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)

        album.performers = [...album.performers, band];
        return await this.albumRepository.save(album);
    }

    async findBandsByAlbumIdBandId(bandId: number, albumId: number): Promise<PerformerDTO> {
        const band = await this.bandRepository.findOne({ where: { id: bandId } });
        if (!band)
            throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)

        const album = await this.albumRepository.findOne({ where: { id: albumId }, relations: { performers: true } });
        if (!album)
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)

        const albumband = album.performers.find(e => e.id === band.id);

        if (!albumband)
            throw new BusinessLogicException("The band with the given id is not associated to the album", BusinessError.PRECONDITION_FAILED)

        return albumband;
    }

    async associateAlbumBand(albumId: number, bandDTO: BandDTO[]): Promise<AlbumDTO> {
        const album = await this.albumRepository.findOne({ where: { id: albumId }, relations: { performers: true } });

        if (!album)
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)

        let bands: Band[] = [];

        for (let i = 0; i < bandDTO.length; i++) {
            const band = await this.bandRepository.findOne({ where: { id: bandDTO[i].id } });
            if (!band)
                throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)
            else 
                bands.push(band);
        }

        album.performers = bands;
        
        return await this.albumRepository.save(album);
    }

    async findBandsByAlbumId(albumId: number): Promise<PerformerDTO[]> {
        const album = await this.albumRepository.findOne({ where: { id: albumId }, relations: { performers: true } });
        if (!album)
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)
        return album.performers.filter(p => p.constructor.name === "Band")
    }

    async deleteBandToAlbum(bandId: number, albumId: number): Promise<AlbumDTO> {
        const band = await this.bandRepository.findOne({ where: { id: bandId } });
        if (!band)
            throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)

        const album = await this.albumRepository.findOne({ where: { id: albumId }, relations: { performers: true } });
        if (!album)
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)

        album.performers = album.performers.filter(e => e.id !== bandId);

        return await this.albumRepository.save(album);
    }
}
