import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Album } from '../album/album.entity';
import { Band } from '../band/band.entity';
import { Collector } from '../collector/collector.entity';
import { CollectorAlbum } from '../collectoralbum/collectoralbum.entity';
import { Comment } from '../comment/comment.entity';
import { Musician } from '../musician/musician.entity';
import { PerformerPrize } from '../performerprize/performerprize.entity';
import { Prize } from '../prize/prize.entity';
import { Track } from '../track/track.entity';
import { DatabaseSeedService } from './database-seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Album, Band, Collector, CollectorAlbum, Comment, Musician, PerformerPrize, Prize, Track])],
  providers: [DatabaseSeedService],
})
export class DatabaseSeedModule {}