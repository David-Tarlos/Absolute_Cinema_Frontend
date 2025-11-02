import axiosClient from './axiosClient';
import { PageResponseDTO } from '@/types/pageDTO';

export interface CastDto {
    id?: number;
    tmdbId: number;
    name: string;
    character?: string;
    profilePath?: string;
    creditOrder?: number;
    movieId: number;
    movieTitle?: string;
}

// Paginated fetch
export const getAllCast = async (
    page: number = 0,
    size: number = 20
): Promise<PageResponseDTO<CastDto>> => {
    const response = await axiosClient.get(`/cast?page=${page}&size=${size}`);
    return response.data;
};

export const getCastByMovieId = async (movieId: number): Promise<CastDto[]> => {
    const response = await axiosClient.get(`/cast/movie/${movieId}`);
    return response.data;
};

export const getCastById = async (id: number): Promise<CastDto> => {
    const response = await axiosClient.get(`/cast/${id}`);
    return response.data;
};

export const createCast = async (cast: CastDto): Promise<CastDto> => {
    const response = await axiosClient.post(`/cast`, cast);
    return response.data;
};

export const updateCast = async (id: number, cast: CastDto): Promise<CastDto> => {
    const response = await axiosClient.put(`/cast/${id}`, cast);
    return response.data;
};

export const deleteCast = async (id: number): Promise<void> => {
    await axiosClient.delete(`/cast/${id}`);
};
