import { rest } from '@makefilm/axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Actor {
  id: string;
  name: string;
  type: string[];
}

interface Director {
  id: string;
  name: string;
  type: string[];
}

interface Genre {
  id: string;
  name: string;
}

interface Movie {
  actors: Actor[];
  description: string;
  directors: Director[];
  genres: Genre[];
  id: string;
  thumbnail: string;
  title: string;
  year: number;
}

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await rest.get(`/movies/${id}`);
        setMovie(response.data.data);
      } catch (err) {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!movie) {
    return <div>No movie found</div>;
  }

  return (
    <div>
      <h1>{movie.title}</h1>
      <img alt={movie.title} src={movie.thumbnail} />
      <p>{movie.description}</p>
      <p>Year: {movie.year}</p>
      <h2>Actors</h2>
      <ul>
        {movie.actors.map((actor) => (
          <li key={actor.id}>{actor.name}</li>
        ))}
      </ul>
      <h2>Directors</h2>
      <ul>
        {movie.directors.map((director) => (
          <li key={director.id}>{director.name}</li>
        ))}
      </ul>
      <h2>Genres</h2>
      <ul>
        {movie.genres.map((genre) => (
          <li key={genre.id}>{genre.name}</li>
        ))}
      </ul>
    </div>
  );
};
