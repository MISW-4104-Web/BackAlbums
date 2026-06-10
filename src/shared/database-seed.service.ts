import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Album } from '../album/album.entity';
import { Band } from '../band/band.entity';
import { Collector } from '../collector/collector.entity';
import { CollectorAlbum } from '../collectoralbum/collectoralbum.entity';
import { Comment } from '../comment/comment.entity';
import { Musician } from '../musician/musician.entity';
import { PerformerPrize } from '../performerprize/performerprize.entity';
import { Prize } from '../prize/prize.entity';
import { Track } from '../track/track.entity';
import { ALBUM_STATUS } from '../albumstatus/albumstatus.enum';
import { GENRE } from '../genre/genre.enum';
import { RECORD_LABEL } from '../recordlabel/recordlabel.enum';

@Injectable()
export class DatabaseSeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,
    @InjectRepository(Musician)
    private readonly musicianRepository: Repository<Musician>,
    @InjectRepository(Collector)
    private readonly collectorRepository: Repository<Collector>,
    @InjectRepository(Prize)
    private readonly prizeRepository: Repository<Prize>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Track)
    private readonly trackRepository: Repository<Track>,
    @InjectRepository(CollectorAlbum)
    private readonly collectorAlbumRepository: Repository<CollectorAlbum>,
    @InjectRepository(PerformerPrize)
    private readonly performerPrizeRepository: Repository<PerformerPrize>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedIfEmpty();
  }

  private async seedIfEmpty(): Promise<void> {
    if (await this.albumRepository.count()) {
      return;
    }

    const albums = await this.albumRepository.save([
      this.albumRepository.create({
        id: 100,
        name: 'Buscando América',
        cover: 'https://i.pinimg.com/564x/aa/5f/ed/aa5fed7fac61cc8f41d1e79db917a7cd.jpg',
        releaseDate: new Date('1984-08-01'),
        description: 'Buscando América es el primer álbum de la banda de Rubén Blades y Seis del Solar lanzado en 1984. La producción, bajo el sello Elektra, fusiona diferentes ritmos musicales tales como la salsa, reggae, rock, y el jazz latino. El disco fue grabado en Eurosound Studios en Nueva York entre mayo y agosto de 1983.',
        genre: GENRE.SALSA,
        recordLabel: RECORD_LABEL.ELEKTRA,
      }),
      this.albumRepository.create({
        id: 101,
        name: 'Poeta del pueblo',
        cover: 'https://cdn.shopify.com/s/files/1/0275/3095/products/image_4931268b-7acf-4702-9c55-b2b3a03ed999_1024x1024.jpg',
        releaseDate: new Date('1984-08-01'),
        description: 'Recopilación de 27 composiciones del cosmos Blades que los bailadores y melómanos han hecho suyas en estos 40 años de presencia de los ritmos y concordias afrocaribeños en múltiples escenarios internacionales. Grabaciones de Blades para la Fania con las orquestas de Pete Rodríguez, Ray Barreto, Fania All Stars y, sobre todo, los grandes éxitos con la Banda de Willie Colón',
        genre: GENRE.SALSA,
        recordLabel: RECORD_LABEL.ELEKTRA,
      }),
      this.albumRepository.create({
        id: 102,
        name: 'A Night at the Opera',
        cover: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png',
        releaseDate: new Date('1975-11-21'),
        description: 'Es el cuarto álbum de estudio de la banda británica de rock Queen, publicado originalmente en 1975. Coproducido por Roy Thomas Baker y Queen, A Night at the Opera fue, en el tiempo de su lanzamiento, la producción más cara realizada. Un éxito comercial, el álbum fue votado por el público y citado por publicaciones musicales como uno de los mejores trabajos de Queen y de la historia del rock.',
        genre: GENRE.ROCK,
        recordLabel: RECORD_LABEL.EMI,
      }),
      this.albumRepository.create({
        id: 103,
        name: 'A Day at the Races',
        cover: 'https://www.udiscovermusic.com/wp-content/uploads/2019/11/a-day-at-the-races.jpg',
        releaseDate: new Date('1976-12-10'),
        description: 'El álbum fue grabado en los Estudios Sarm West, The Manor and Wessex en Inglaterra y con el ingeniero Mike Stone. El título del álbum es una referencia directa al anterior, A Night at the Opera. Ambos álbumes están titulados como películas de los hermanos Marx.',
        genre: GENRE.ROCK,
        recordLabel: RECORD_LABEL.EMI,
      }),
    ]);

    const collectorOne = this.collectorRepository.create({ id: 100, name: 'Manolo Bellon', telephone: '3502457896', email: 'manollo@caracol.com.co' });
    const collectorTwo = this.collectorRepository.create({ id: 101, name: 'Jaime Monsalve', telephone: '3012357936', email: 'jmonsalve@rtvc.com.co' });
    const collectors = await this.collectorRepository.save([collectorOne, collectorTwo]);

    const prizeOne = this.prizeRepository.create({ id: 100, organization: 'National Academy of Recording Arts & Sciences', name: 'Grammy Award', description: 'Grammy Award, any of a series of awards presented annually in the United States by the National Academy of Recording Arts & Sciences' });
    const prizeTwo = this.prizeRepository.create({ id: 101, organization: 'Univisión', name: 'Premios lo Nuestro', description: 'Es una ceremonia de entrega de premios a los mejores músicos latinos del año. Premio Lo Nuestro es presentado por la cadena de televisión Univisión, y fueron creados en 1989, siendo la entrega de premios más antigua en la historia musical latina.' });
    const prizes = await this.prizeRepository.save([prizeOne, prizeTwo]);

    const musician = await this.musicianRepository.save(this.musicianRepository.create({
      id: 100,
      name: 'Rubén Blades Bellido de Luna',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Ruben_Blades_by_Gage_Skidmore.jpg/800px-Ruben_Blades_by_Gage_Skidmore.jpg',
      description: 'Es un cantante, compositor, músico, actor, abogado, político y activista panameño. Ha desarrollado gran parte de su carrera artística en la ciudad de Nueva York.',
      birthDate: new Date('1948-07-16'),
    }));

    const band = await this.bandRepository.save(this.bandRepository.create({
      id: 101,
      name: 'Queen',
      image: 'https://pm1.narvii.com/6724/a8b29909071e9d08517b40c748b6689649372852v2_hq.jpg',
      description: 'Queen es una banda británica de rock formada en 1970 en Londres por el cantante Freddie Mercury, el guitarrista Brian May, el baterista Roger Taylor y el bajista John Deacon. Si bien el grupo ha presentado bajas de dos de sus miembros (Mercury, fallecido en 1991, y Deacon, retirado en 1997), los integrantes restantes, May y Taylor, continúan trabajando bajo el nombre Queen, por lo que la banda aún se considera activa.',
      creationDate: new Date('1970-01-01'),
    }));

    musician.albums = [albums[0], albums[1]];
    musician.collectors = [collectors[0]];
    band.albums = [albums[2], albums[3]];
    band.collectors = [collectors[1]];

    await this.musicianRepository.save(musician);
    await this.bandRepository.save(band);

    await this.trackRepository.save([
      this.trackRepository.create({ id: 100, name: 'Decisiones', duration: '5:05', album: albums[0] }),
      this.trackRepository.create({ id: 101, name: 'Desapariciones', duration: '6:29', album: albums[0] }),
    ]);

    await this.commentRepository.save([
      this.commentRepository.create({ id: 100, description: 'The most relevant album of Ruben Blades', rating: 5, album: albums[0], collector: collectors[0] }),
      this.commentRepository.create({ id: 101, description: 'I love this album of Queen', rating: 5, album: albums[2], collector: collectors[1] }),
    ]);

    await this.collectorAlbumRepository.save([
      this.collectorAlbumRepository.create({ id: 100, price: 35, status: ALBUM_STATUS.ACTIVE, album: albums[0], collector: collectors[0] }),
      this.collectorAlbumRepository.create({ id: 101, price: 25, status: ALBUM_STATUS.ACTIVE, album: albums[1], collector: collectors[1] }),
    ]);

    await this.performerPrizeRepository.save([
      this.performerPrizeRepository.create({ id: 100, premiationDate: new Date('1978-12-10'), prize: prizes[0], performer: musician }),
      this.performerPrizeRepository.create({ id: 101, premiationDate: new Date('1980-12-10'), prize: prizes[1], performer: band }),
    ]);
  }
}