delete from public.performer_albums_album;
delete from public.collector_album;
delete from public.performer_collectors_collector;
delete from public.performer_prize;
delete from public.performer;
delete from public.comment;
delete from track;
delete from public.album;
delete from public.collector;
delete from public.prize;

INSERT INTO public.album(
	id, name, cover, "releaseDate", description, genre, "recordLabel")
	VALUES (100,'Buscando América', 'https://i.pinimg.com/564x/aa/5f/ed/aa5fed7fac61cc8f41d1e79db917a7cd.jpg', '1984-08-01', 'Buscando América es el primer álbum de la banda de Rubén Blades y Seis del Solar lanzado en 1984. La producción, bajo el sello Elektra, fusiona diferentes ritmos musicales tales como la salsa, reggae, rock, y el jazz latino. El disco fue grabado en Eurosound Studios en Nueva York entre mayo y agosto de 1983.','Salsa', 'Elektra');

INSERT INTO public.album(
	id, name, cover, "releaseDate", description, genre, "recordLabel")
	VALUES (101,'Poeta del pueblo', 'https://cdn.shopify.com/s/files/1/0275/3095/products/image_4931268b-7acf-4702-9c55-b2b3a03ed999_1024x1024.jpg', '1984-08-01', 'Recopilación de 27 composiciones del cosmos Blades que los bailadores y melómanos han hecho suyas en estos 40 años de presencia de los ritmos y concordias afrocaribeños en múltiples escenarios internacionales. Grabaciones de Blades para la Fania con las orquestas de Pete Rodríguez, Ray Barreto, Fania All Stars y, sobre todo, los grandes éxitos con la Banda de Willie Colón', 'Salsa', 'Elektra');

INSERT INTO public.album(
	id, name, cover, "releaseDate", description, genre, "recordLabel")
	VALUES (102,'A Night at the Opera', 'https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png', '1975-11-21', 'Es el cuarto álbum de estudio de la banda británica de rock Queen, publicado originalmente en 1975. Coproducido por Roy Thomas Baker y Queen, A Night at the Opera fue, en el tiempo de su lanzamiento, la producción más cara realizada.1​ Un éxito comercial, el álbum fue votado por el público y citado por publicaciones musicales como uno de los mejores trabajos de Queen y de la historia del rock.', 'Rock', 'EMI');

INSERT INTO public.album(
	id, name, cover, "releaseDate", description, genre, "recordLabel")
	VALUES (103,'A Day at the Races', 'https://www.udiscovermusic.com/wp-content/uploads/2019/11/a-day-at-the-races.jpg', '1976-12-10', 'El álbum fue grabado en los Estudios Sarm West, The Manor and Wessex en Inglaterra y con el ingeniero Mike Stone. El título del álbum es una referencia directa al anterior, A Night at the Opera. Ambos álbumes están titulados como películas de los hermanos Marx.', 'Rock', 'EMI');

--Inserting musicians

INSERT INTO public.performer(
	id, name, image, description, "birthDate", "creationDate", type, "bandId")
	VALUES (100, 'Rubén Blades Bellido de Luna', 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Ruben_Blades_by_Gage_Skidmore.jpg/800px-Ruben_Blades_by_Gage_Skidmore.jpg', 'Es un cantante, compositor, músico, actor, abogado, político y activista panameño. Ha desarrollado gran parte de su carrera artística en la ciudad de Nueva York.',
	'1948-07-16', null, 'Musician' , null);
	
--Inserting bands

INSERT INTO public.performer(
	id, name, image, description, "birthDate", "creationDate", type, "bandId")
	VALUES (101, 'Queen', 'https://pm1.narvii.com/6724/a8b29909071e9d08517b40c748b6689649372852v2_hq.jpg', 'Queen es una banda británica de rock formada en 1970 en Londres por el cantante Freddie Mercury, el guitarrista Brian May, el baterista Roger Taylor y el bajista John Deacon. Si bien el grupo ha presentado bajas de dos de sus miembros (Mercury, fallecido en 1991, y Deacon, retirado en 1997), los integrantes restantes, May y Taylor, continúan trabajando bajo el nombre Queen, por lo que la banda aún se considera activa.',
	null, '1970-01-01', 'Band' , null);

--Inserting musician - album

INSERT INTO public.performer_albums_album(
	"performerId", "albumId")
	VALUES(100, 100);

INSERT INTO public.performer_albums_album(
	"performerId", "albumId")
	VALUES(100, 101);

--Inserting band - album

INSERT INTO public.performer_albums_album(
	"performerId", "albumId")
	VALUES(101, 102);

INSERT INTO public.performer_albums_album(
	"performerId", "albumId")
	VALUES(101, 103);

--Inserting collector

INSERT INTO public.collector(
	id, name, telephone, email)
	VALUES(100, 'Manolo Bellon', '3502457896', 'manollo@caracol.com.co');

INSERT INTO public.collector(
	id, name, telephone, email)
	VALUES(101, 'Jaime Monsalve', '3012357936', 'jmonsalve@rtvc.com.co');

--Inserting collector_album

INSERT INTO public.collector_album(
	id, price, status, "albumId", "collectorId")
	VALUES(100, 35, 'Active', 100, 100);

INSERT INTO public.collector_album(
	id, price, status, "albumId", "collectorId")
	VALUES(101, 25, 'Active', 101, 101);

--Inserting comment

INSERT INTO public.comment(
	id, description, rating, "albumId", "collectorId")
	VALUES(100, 'The most relevant album of Ruben Blades', 5, 100, 100);

INSERT INTO public.comment(
	id, description, rating, "albumId", "collectorId")
	VALUES(101, 'I love this album of Queen', 5, 102, 101);

--Inserting performer - collector

INSERT INTO public.performer_collectors_collector(
	"performerId", "collectorId")
	VALUES(100, 100);

INSERT INTO public.performer_collectors_collector(
	"performerId", "collectorId")
	VALUES(101, 101);


--Inserting prize

INSERT INTO public.prize(
	id, organization, name, description)
	VALUES(100, 'National Academy of Recording Arts & Sciences', 'Grammy Award', 'Grammy Award, any of a series of awards presented annually in the United States by the National Academy of Recording Arts & Sciences');

INSERT INTO public.prize(
	id, organization, name, description)
	VALUES(101, 'Univisión', 'Premios lo Nuestro', 'Es una ceremonia de entrega de premios a los mejores músicos latinos del año. Premio Lo Nuestro es presentado por la cadena de televisión Univisión, y fueron creados en 1989, siendo la entrega de premios más antigua en la historia musical latina.');


--Inserting performer prize

INSERT INTO public.performer_prize(
	id, "premiationDate", "prizeId", "performerId")
	VALUES(100, '1978-12-10', 100, 100);

INSERT INTO public.performer_prize(
	id, "premiationDate", "prizeId", "performerId")
	VALUES(101, '1980-12-10', 101, 101);


--Inserting track
	

INSERT INTO public.track(id,name,duration,"albumId") VALUES
(100,'Decisiones','5:05',100),
(101,'Desapariciones','6:29',100),
(102,'GDBD','4:45',100),
(103,'Todos Vuelven','5:15',100),
(104,'Caminitos Verdes','5:12',100),
(105,'El Padre Antonio y el Monaguillo Andrés','7:08',100),
(106,'Buscando América','6:01',100);

INSERT INTO public.track(id,name,duration,"albumId") VALUES
(200,'Death on Two Legs','3:43',102),
(201,'Lazing on a Sunday Afternoon','1:08',102),
(202,'I''m in Love with My Car','3:05',102),
(203,'You''re My Best Friend','2:52',102),
(204,'''39','3:31',102),
(205,'Sweet Lady','4:03',102),
(206,'Seaside Rendezvous','2:14',102),
(207,'The Prophet''s Song','8:21',102),
(208,'Love of My Life','3:39',102),
(209,'Good Company','3:26',102),
(210,'Bohemian Rhapsody','5:55',102),
(211,'God Save the Queen','1:18',102);

INSERT INTO public.track(id,name,duration,"albumId") VALUES
(300,'Tie Your Mother Down','4:48',103),
(301,'You Take My Breath Away','5:09',103),
(302,'Long Away','3:33',103),
(303,'The Millionaire Waltz','4:54',103),
(304,'You and I','3:28',103),
(305,'Somebody to Love','4:56',103),
(306,'White Man','4:59',103),
(307,'Good Old-Fashioned Lover Boy','2:54',103),
(308,'Drowse','3:45',103),
(309,'Teo Torriatte (Let Us Cling Together)','5:50',103);