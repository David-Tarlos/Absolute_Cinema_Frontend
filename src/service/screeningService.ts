// src/service/screeningService.ts
import axiosClient from './axiosClient';
import { MovieResponseDTO } from './movieService';

// Room/Theater types
export enum RoomType {
    STANDARD = 'STANDARD',
    PREMIUM = 'PREMIUM',
    IMAX = 'IMAX',
    VIP = 'VIP'
}

// Screening DTOs
export interface ScreeningResponseDTO {
    id: number;
    movieId: number;
    movie?: MovieResponseDTO;
    roomNumber: number;
    roomType: RoomType;
    screeningTime: string; // ISO datetime string
    price: number;
    availableSeats: number;
    totalSeats: number;
}

export interface SeatResponseDTO {
    id: number;
    screeningId: number;
    row: string;
    seatNumber: number;
    isAvailable: boolean;
    isReserved: boolean;
    seatType?: 'STANDARD' | 'PREMIUM' | 'WHEELCHAIR';
}

export interface ReservationRequestDTO {
    screeningId: number;
    seatIds: number[];
    customerEmail?: string;
    customerName?: string;
}

export interface ReservationResponseDTO {
    id: number;
    screeningId: number;
    seats: SeatResponseDTO[];
    totalPrice: number;
    reservationTime: string;
    customerEmail?: string;
    customerName?: string;
    confirmed: boolean;
}

// Get all screenings for a specific movie
export const getScreeningsByMovie = async (movieId: number): Promise<ScreeningResponseDTO[]> => {
    const response = await axiosClient.get(`/screenings/movie/${movieId}`);
    return response.data;
};

// Get screenings by date
export const getScreeningsByDate = async (date: string): Promise<ScreeningResponseDTO[]> => {
    const response = await axiosClient.get(`/screenings/date/${date}`);
    return response.data;
};

// Get screening by ID
export const getScreeningById = async (screeningId: number): Promise<ScreeningResponseDTO> => {
    const response = await axiosClient.get(`/screenings/${screeningId}`);
    return response.data;
};

// Get seats for a specific screening
export const getSeatsByScreening = async (screeningId: number): Promise<SeatResponseDTO[]> => {
    const response = await axiosClient.get(`/screenings/${screeningId}/seats`);
    return response.data;
};

// Create a reservation
export const createReservation = async (
    reservation: ReservationRequestDTO
): Promise<ReservationResponseDTO> => {
    const response = await axiosClient.post(`/reservations`, reservation);
    return response.data;
};

// Get reservation by ID
export const getReservationById = async (reservationId: number): Promise<ReservationResponseDTO> => {
    const response = await axiosClient.get(`/reservations/${reservationId}`);
    return response.data;
};
