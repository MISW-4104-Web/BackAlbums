import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ALBUM_STATUS } from '../albumstatus/albumstatus.enum';
import { Album } from '../album/album.entity';
import { Collector } from '../collector/collector.entity';

@Entity()
export class CollectorAlbum {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    price: number;

    @Column({
        type: "text"
    })
    status: ALBUM_STATUS

    @ManyToOne(type => Album, album => album.collectorAlbums)
    album: Album;

    @ManyToOne(type => Collector, collector => collector.collectorAlbums)
    collector: Collector;
}