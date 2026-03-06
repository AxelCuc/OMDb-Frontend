"use client";

import { useState } from 'react';

// Interfaces de TS para los datos recibidos
interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchMovies = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);
    setMovies([]); // Limpiamos resultados anteriores

    try {
      // Llamada a NUESTRO proxy local (Backend), no a la API externa
      const response = await fetch(`http://localhost:4000/api/movies/search?q=${searchTerm}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error de conexión con el servidor.');
      }
      
      const data = await response.json();
      setMovies(data);
    } catch (err: any) {
      // Estado de Error: Mensaje amigable
      setError(err.message || "¡Ups! Ocurrió un error inesperado.");
    } finally {
      // Se ejecuta siempre, haya éxito o error
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-900 text-white font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-yellow-500">Buscador de Películas (SOA)</h1>
        
        {/* Formulario de búsqueda */}
        <form onSubmit={fetchMovies} className="flex justify-center mb-12">
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ej: Star Wars, Matrix, Avengers..."
            className="p-4 rounded-l-lg bg-gray-800 text-white placeholder-gray-400 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          <button 
            type="submit" 
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold p-4 rounded-r-lg transition-colors"
          >
            Buscar
          </button>
        </form>

        {/* ESTADO 1: Loading (Indicador de carga) */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500"></div>
          </div>
        )}

        {/* ESTADO 2: Error (Mensaje amigable y la app no se rompe) */}
        {error && !loading && (
          <div className="bg-red-500/20 border border-red-500 text-red-100 p-4 rounded-lg text-center max-w-lg mx-auto">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* ESTADO 3: Success (Renderizado estético de información) */}
        {!loading && !error && movies.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {movies.map((movie) => (
              <div key={movie.imdbID} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-yellow-500 transition-colors">
                <img 
                  src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=Sin+Poster"} 
                  alt={movie.Title} 
                  className="w-full h-96 object-cover"
                />
                <div className="p-5">
                  <h2 className="text-xl font-bold mb-2 truncate text-gray-100" title={movie.Title}>{movie.Title}</h2>
                  <p className="text-md text-yellow-500 font-medium">Año: {movie.Year}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}