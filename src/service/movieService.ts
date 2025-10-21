// src/services/movieService.ts
import axiosClient from './axiosClient';
import { GenreDto } from './genreService';

// Request DTO
export interface MovieRequestDTO {
    title: string;
    overview?: string;
    posterPath?: string;
    backdropPath?: string;
    voteAverage?: number;
    voteCount?: number;
    releaseDate?: string; // ISO string
    runtime?: number;
    status?: string;
    popularity?: number;
    originalLanguage?: string;
    originalTitle?: string;
    tmdbId: number;
    genreIds?: number[];
}

// Response DTO
export interface MovieResponseDTO {
    id: number;
    tmdbId: number;
    title: string;
    overview?: string;
    posterPath?: string;
    backdropPath?: string;
    voteAverage?: number;
    voteCount?: number;
    releaseDate?: string;
    runtime?: number;
    status?: string;
    popularity?: number;
    originalLanguage?: string;
    originalTitle?: string;
    genres?: GenreDto[];
    trailerKey?: string;
}

// Generic PageResponseDTO (matches backend)
export interface PageResponseDTO<T> {
    content: T[];
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    empty: boolean;
    numberOfElements: number;
}

// Get all movies (paginated + sorting)
export const getAllMovies = async (
    page: number = 0,
    size: number = 20,
    sortBy: string = 'id',
    sortDirection: 'ASC' | 'DESC' = 'ASC'
): Promise<PageResponseDTO<MovieResponseDTO>> => {
    const response = await axiosClient.get(
        `/movies?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );
    return response.data;
};

// Get movie by ID
export const getMovieById = async (id: number): Promise<MovieResponseDTO> => {
    const response = await axiosClient.get(`/movies/${id}`);
    return response.data;
};

// Search movies by title
export const searchMovies = async (
    title: string,
    page: number = 0,
    size: number = 20,
    sortBy: string = 'title',
    sortDirection: 'ASC' | 'DESC' = 'ASC'
): Promise<PageResponseDTO<MovieResponseDTO>> => {
    const response = await axiosClient.get(
        `/movies/search?title=${encodeURIComponent(title)}&page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );
    return response.data;
};

// Get movies by genre
export const getMoviesByGenre = async (
    genreId: number,
    page: number = 0,
    size: number = 20,
    sortBy: string = 'popularity',
    sortDirection: 'ASC' | 'DESC' = 'DESC'
): Promise<PageResponseDTO<MovieResponseDTO>> => {
    const response = await axiosClient.get(
        `/movies/genre/${genreId}?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );
    return response.data;
};

// Get movies by release year
export const getMoviesByYear = async (
    year: number,
    page: number = 0,
    size: number = 20,
    sortBy: string = 'releaseDate',
    sortDirection: 'ASC' | 'DESC' = 'DESC'
): Promise<PageResponseDTO<MovieResponseDTO>> => {
    const response = await axiosClient.get(
        `/movies/year/${year}?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );
    return response.data;
};

// Get movies by date range
export const getMoviesByDateRange = async (
    startDate: string, // ISO string
    endDate: string,   // ISO string
    page: number = 0,
    size: number = 20,
    sortBy: string = 'releaseDate',
    sortDirection: 'ASC' | 'DESC' = 'DESC'
): Promise<PageResponseDTO<MovieResponseDTO>> => {
    const response = await axiosClient.get(
        `/movies/date-range?startDate=${startDate}&endDate=${endDate}&page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );
    return response.data;
};

// Create a new movie
export const createMovie = async (movie: MovieRequestDTO): Promise<MovieResponseDTO> => {
    const response = await axiosClient.post(`/movies`, movie);
    return response.data;
};

// Update a movie by ID
export const updateMovie = async (id: number, movie: MovieRequestDTO): Promise<MovieResponseDTO> => {
    const response = await axiosClient.put(`/movies/${id}`, movie);
    return response.data;
};

// Delete a movie by ID
export const deleteMovie = async (id: number): Promise<void> => {
    await axiosClient.delete(`/movies/${id}`);
};
