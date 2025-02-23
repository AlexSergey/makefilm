import { fetchMovies } from '@makefilm/fe-business-logic';
import { AppDispatch, RootState } from '@makefilm/fe-business-logic';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export const MovieList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const movies = useSelector((state: RootState) => state.movies.movies);
  const loading = useSelector((state: RootState) => state.movies.loading);
  const error = useSelector((state: RootState) => state.movies.error);
  console.log(movies);
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Movies</h1>
      <ul>
        {movies.map((movie) => (
          <li key={movie.id}>
            <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
