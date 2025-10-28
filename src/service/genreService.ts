// src/services/genreService.ts
import axiosClient from './axiosClient';

// DTO for Genre
export interface GenreDto {
    id?: number;
    name: string;
    movieIds?: number[];
}

// Generic paginated response
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

// Get all genres (paginated)
export const getAllGenresPaginated = async (
    page: number = 0,
    size: number = 10
): Promise<PageResponseDTO<GenreDto>> => {
    const response = await axiosClient.get(`/genres?paginated=true&page=${page}&size=${size}`);
    return response.data;
};

// Get all genres (non-paginated)
export const getAllGenres = async (): Promise<GenreDto[]> => {
    const response = await axiosClient.get(`/genres`);
    return response.data;
};

// Get a genre by ID
export const getGenreById = async (id: number): Promise<GenreDto> => {
    const response = await axiosClient.get(`/genres/${id}`);
    return response.data;
};

// Create a new genre
export const createGenre = async (genre: GenreDto): Promise<GenreDto> => {
    const response = await axiosClient.post(`/genres`, genre);
    return response.data;
};

// Update a genre by ID
export const updateGenre = async (id: number, genre: GenreDto): Promise<GenreDto> => {
    const response = await axiosClient.put(`/genres/${id}`, genre);
    return response.data;
};

// Delete a genre by ID
export const deleteGenre = async (id: number): Promise<void> => {
    await axiosClient.delete(`/genres/${id}`);
};
