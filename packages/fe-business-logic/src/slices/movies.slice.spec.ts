import { rest } from '@makefilm/axios';
import { configureStore } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';

import moviesReducer, { fetchMovies } from './movies.slice';

const mock = new MockAdapter(rest);

const movieData = [
  {
    actors: [{ id: '1', name: 'Actor 1', type: ['actor'] }],
    description: 'Horror film description',
    directors: [{ id: '2', name: 'Director 1', type: ['director'] }],
    genres: [{ id: '3', name: 'Horror' }],
    id: '4',
    thumbnail: 'posters/4.jpeg',
    title: 'The Grudge',
    year: 2020,
  },
];

describe('moviesSlice', () => {
  it('should handle initial state', () => {
    expect(moviesReducer(undefined, { type: 'unknown' })).toEqual({
      error: null,
      loading: false,
      movies: [],
    });
  });

  it('should handle fetchMovies', async () => {
    mock.onGet('http://localhost:3005/api/movies').reply(200, { data: movieData });

    const store = configureStore({ reducer: { movies: moviesReducer } });

    await store.dispatch(fetchMovies());

    const state = store.getState().movies;

    expect(state.movies).toEqual(movieData);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(null);
  });

  it('should handle fetchMovies error', async () => {
    mock.onGet('http://localhost:3005/api/movies').reply(500);

    const store = configureStore({ reducer: { movies: moviesReducer } });

    await store.dispatch(fetchMovies());

    const state = store.getState().movies;
    expect(state.movies).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Request failed with status code 500');
  });
});
