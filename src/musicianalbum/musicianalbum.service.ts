import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessLogicException, BusinessError } from "../shared/errors/business-errors";
import { Repository } from 'typeorm';
import { Musician } from '../musician/musician.entity';
import { Album } from '../album/album.entity';
import { AlbumDTO } from '../album/album.dto';
import { MusicianDTO } from '../musician/musician.dto';

@Injectable()
export class MusicianAlbumService {
    constructor(
        @InjectRepository(Musician)
        private readonly musicianRepository: Repository<Musician>,

        @InjectRepository(Album)
        private readonly albumRepository: Repository<Album>) { }

    async addMusicianAlbum(musicianId: number, albumId: number): Promise<AlbumDTO> {
        const musician = await this.musicianRepository.findOne({ where: { id: musicianId } });
        if (!musician)
            throw new BusinessLogicException("The musician with the given id was not found", BusinessError.NOT_FOUND)

        const album = await this.albumRepository.findOne({ where: { id: albumId }, relations: { performers: true } });
        if (!album)
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)

        album.performers = [...album.performers, musician];
        return await this.albumRepository.save(album);
    }

    async findAlbumsByMusicianIdAlbumId(musicianId: number, albumId: number): Promise<AlbumDTO> {
        const musician = await this.musicianRepository.findOne({ where: { id: musicianId }, relations: { albums: true } });
        if (!musician)
            throw new BusinessLogicException("The musician with the given id was not found", BusinessError.NOT_FOUND)

        const album = await this.albumRepository.findOne({ where: { id: albumId } });
        if (!album)
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)

        const musicianalbum = musician.albums.find(e => e.id === album.id);

        if (!musicianalbum)
            throw new BusinessLogicException("The album with the given id is not associated to the musician", BusinessError.PRECONDITION_FAILED)

        return musicianalbum;
    }

    async associateMusicianAlbum(musicianId: number, albumDTO: AlbumDTO[]): Promise<MusicianDTO> {
        const musician = await this.musicianRepository.findOne({ where: { id: musicianId }, relations: { albums: true } });

        if (!musician)
            throw new BusinessLogicException("The musician with the given id was not found", BusinessError.NOT_FOUND)

        let albums: Album[] = [];

        for (let i = 0; i < albumDTO.length; i++) {
            const album = await this.albumRepository.findOne({ where: { id: albumDTO[i].id } });
            if (!album)
                throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)
            albums.push(album);
        }

        musician.albums = albums;
        return await this.musicianRepository.save(musician);
    }

    async findAlbumsByMusicianId(musicianId: number): Promise<AlbumDTO[]> {
        const musician = await this.musicianRepository.findOne({ where: { id: musicianId }, relations: { albums: true } });
        if (!musician)
            throw new BusinessLogicException("The musician with the given id was not found", BusinessError.NOT_FOUND)

        return musician.albums;
    }

    async deleteAlbumToMusician(musicianId: number, albumId: number) {
        const musician = await this.musicianRepository.findOne({ where: { id: musicianId }, relations: { albums: true } });
        if (!musician)
            throw new BusinessLogicException("The musician with the given id was not found", BusinessError.NOT_FOUND)

        const album = await this.albumRepository.findOne({ where: { id: albumId } });
        if (!album)
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)

        musician.albums = musician.albums.filter(e => {
            e.id !== albumId
        });

        return await this.musicianRepository.save(musician);
    }
}
