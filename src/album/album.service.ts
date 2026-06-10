import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Album } from './album.entity';
import { Repository } from 'typeorm';
import { AlbumDTO } from './album.dto';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import * as Joi from "joi";
import { validate } from "../shared/validation";

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(Album)
        private readonly albumRepository: Repository<Album>
    ) { }

    async findAll(): Promise<AlbumDTO[]> {
        return await this.albumRepository.find({ relations: { tracks: true, performers: true, comments: true } });
    }

    async findOne(id: number): Promise<AlbumDTO> {
        const album = await this.albumRepository.findOne({ where: { id }, relations: { tracks: true, performers: true, comments: true } });
        if (!album) 
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)
        else 
            return album;
    }

    async create(albumDTO: AlbumDTO): Promise<AlbumDTO> {
        const { error } = validate(this.schema, albumDTO);

        if(error) 
            throw new BusinessLogicException(error.toString(), BusinessError.BAD_REQUEST)    
        else {
            const album = new Album();
            album.name = albumDTO.name;
            album.cover = albumDTO.cover;
            album.releaseDate = albumDTO.releaseDate;
            album.description = albumDTO.description;
            album.genre = albumDTO.genre;
            album.recordLabel = albumDTO.recordLabel;

            return await this.albumRepository.save(album);
        }
    }

    async update(id: number, albumDTO: AlbumDTO): Promise<AlbumDTO> {

        const album = await this.albumRepository.findOneBy({id: id});;
        if (!album)
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)
        else {
            const { error } = validate(this.schema, albumDTO);

            if(error)
                throw new BusinessLogicException(error.toString(), BusinessError.BAD_REQUEST)    
            else {
                album.name = albumDTO.name;
                album.cover = albumDTO.cover;
                album.releaseDate = albumDTO.releaseDate;
                album.description = albumDTO.description;
                album.genre = albumDTO.genre;
                album.recordLabel = albumDTO.recordLabel;
                await this.albumRepository.save(album);
                return album;
            }
        }
    }

    async delete(id: number) {
        const album = await this.albumRepository.findOneBy({id: id});;
        if (!album)
            throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND)
        else 
            return await this.albumRepository.remove(album);
    }

    schema = Joi.object({
        name: Joi.string().required(),  
        cover: Joi.string().required(),  
        releaseDate: Joi.date().required(),
        description: Joi.string().required(), 
        genre: Joi.string().valid('Classical','Salsa', 'Rock', 'Folk').required(),
        recordLabel: Joi.string().valid('Sony Music','EMI', 'Discos Fuentes', 'Elektra','Fania Records').required(),
    })
}
