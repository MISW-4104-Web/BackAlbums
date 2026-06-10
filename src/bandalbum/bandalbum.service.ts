import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException, BusinessError } from "../shared/errors/business-errors";
import { Repository } from 'typeorm';
import { Band } from '../band/band.entity';
import { Album } from '../album/album.entity';
import { AlbumDTO } from '../album/album.dto';
import { BandDTO } from '../band/band.dto';

@Injectable()
export class BandAlbumService {
    constructor(
        @InjectRepository(Band)
        private readonly bandRepository: Repository<Band>,

        @InjectRepository(Album)
        private readonly albumRepository: Repository<Album>) { }

    async addBandAlbum(bandId: number, albumId: number): Promise<AlbumDTO> {
        const band = await this.bandRepository.findOne({ where: { id: bandId } });
        if (!band)
            throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)

        const album = await this.albumRepository.findOne({ where: { id: albumId }, relations: { performers: true } });
        if (!album)
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)

        album.performers = [band];
        return await this.albumRepository.save(album);
    }

    async findAlbumsByBandIdAlbumId(bandId: number, albumId: number): Promise<AlbumDTO> {
        const band = await this.bandRepository.findOne({ where: { id: bandId }, relations: { albums: true } });
        if (!band)
            throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)

        const album = await this.albumRepository.findOne({ where: { id: albumId } });
        if (!album)
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)

        const bandalbum = band.albums.find(e => e.id === album.id);

        if (!bandalbum)
            throw new BusinessLogicException("The album with the given id is not associated to the band", BusinessError.PRECONDITION_FAILED)

        return bandalbum;
    }

    async associateBandAlbum(bandId: number, albumDTO: AlbumDTO[]): Promise<BandDTO> {
        const band = await this.bandRepository.findOne({ where: { id: bandId }, relations: { albums: true } });

        if (!band)
            throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)

        let albums: Album[] = [];

        for (let i = 0; i < albumDTO.length; i++) {
            const album = await this.albumRepository.findOne({ where: { id: albumDTO[i].id } });
            if (!album)
                throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)
            else
                albums.push(album);
        }

        band.albums = albums;
        return await this.bandRepository.save(band);
    }

    async findAlbumsByBandId(bandId: number): Promise<AlbumDTO[]> {
        const band = await this.bandRepository.findOne({ where: { id: bandId }, relations: { albums: true } });
        if (!band)
            throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)

        return band.albums;
    }

    async deleteAlbumToBand(bandId: number, albumId: number): Promise<BandDTO> {
        const band = await this.bandRepository.findOne({ where: { id: bandId }, relations: { albums: true } });
        if (!band)
            throw new BusinessLogicException("The band with the given id was not found", BusinessError.NOT_FOUND)

        const album = await this.albumRepository.findOne({ where: { id: albumId } });
        if (!album)
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)

        band.albums = band.albums.filter(e => {
            e.id !== albumId
        });

        return await this.bandRepository.save(band);
    }
}
