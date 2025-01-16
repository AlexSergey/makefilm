import { CreatorTypes } from '@api/modules/movie/entities/creator.entity';

export const mockMovies = [
  {
    actors: [{ id: '73273635-2a3b-4216-8d3b-f9a40d5506a4', name: 'Actor 1', type: [CreatorTypes.actor] }],
    description: 'Horror film description',
    directors: [{ id: '73273635-2a3b-4216-8d3b-f9a40d5506a5', name: 'Director 1', type: [CreatorTypes.director] }],
    genres: [{ id: '73273635-2a3b-4216-8d3b-f9a40d5506a6', name: 'Horror' }],
    id: '73273635-2a3b-4216-8d3b-f9a40d5506a7',
    thumbnail: 'posters/73273635-2a3b-4216-8d3b-f9a40d5506a7.jpeg',
    title: 'The Grudge',
    year: 2020,
  },
];
