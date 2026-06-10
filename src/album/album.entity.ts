import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { Performer } from '../performer/performer.entity';
import { RECORD_LABEL } from '../recordlabel/recordlabel.enum';
import { GENRE } from '../genre/genre.enum';
import { Track } from '../track/track.entity';
import { Comment } from '../comment/comment.entity';
import { CollectorAlbum } from '../collectoralbum/collectoralbum.entity';

@Entity()
export class Album {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    cover: string;

    @Column()
    releaseDate: Date;

    @Column()
    description: string;

    @Column({
        type: "text"
    })
    genre: GENRE

    @Column({
        type: "text"
    })
    recordLabel: RECORD_LABEL

    @ManyToMany(type => Performer, performer => performer.albums)
    performers: Performer[];

    @OneToMany(type => Track, track => track.album)
    tracks: Track[];

    @OneToMany(type => Comment, comment => comment.album, {
        cascade: true
    })
    comments: Comment[];

    @OneToMany(type => CollectorAlbum, collectorAlbum => collectorAlbum.album)
    collectorAlbums: CollectorAlbum[];

}