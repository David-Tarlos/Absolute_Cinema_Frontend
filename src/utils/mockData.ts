// src/utils/mockData.ts
// Mock data for testing without backend connection
import { ScreeningResponseDTO, SeatResponseDTO, RoomType } from "@/service/screeningService";
import { MovieResponseDTO } from "@/service/movieService";

export const mockMovie: MovieResponseDTO = {
    id: 1,
    tmdbId: 155,
    title: "The Dark Knight",
    overview: "Batman raises the stakes in his war on crime with the help of Lt. Jim Gordon and District Attorney Harvey Dent.",
    posterPath: "/absolute_filmora.png",
    backdropPath: "/backdrop.jpg",
    voteAverage: 9.0,
    voteCount: 28000,
    releaseDate: "2008-07-18",
    runtime: 152,
    status: "Released",
    popularity: 95.5,
    originalLanguage: "en",
    originalTitle: "The Dark Knight",
};

export const mockScreenings: ScreeningResponseDTO[] = [
    // Today - Standard Room
    {
        id: 1,
        movieId: 1,
        roomNumber: 1,
        roomType: RoomType.STANDARD,
        screeningTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
        price: 12.50,
        availableSeats: 75,
        totalSeats: 92,
    },
    {
        id: 2,
        movieId: 1,
        roomNumber: 2,
        roomType: RoomType.PREMIUM,
        screeningTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
        price: 18.00,
        availableSeats: 45,
        totalSeats: 124,
    },
    {
        id: 3,
        movieId: 1,
        roomNumber: 3,
        roomType: RoomType.IMAX,
        screeningTime: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
        price: 22.50,
        availableSeats: 180,
        totalSeats: 220,
    },
    // Tomorrow
    {
        id: 4,
        movieId: 1,
        roomNumber: 1,
        roomType: RoomType.STANDARD,
        screeningTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // Tomorrow
        price: 12.50,
        availableSeats: 80,
        totalSeats: 92,
    },
    {
        id: 5,
        movieId: 1,
        roomNumber: 4,
        roomType: RoomType.VIP,
        screeningTime: new Date(Date.now() + 28 * 60 * 60 * 1000).toISOString(), // Tomorrow
        price: 35.00,
        availableSeats: 30,
        totalSeats: 40,
    },
    {
        id: 6,
        movieId: 1,
        roomNumber: 3,
        roomType: RoomType.IMAX,
        screeningTime: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString(), // Tomorrow evening
        price: 22.50,
        availableSeats: 5,
        totalSeats: 220,
    },
];

// Generate mock seats for a screening
export const generateMockSeats = (screeningId: number, roomType: RoomType): SeatResponseDTO[] => {
    const seats: SeatResponseDTO[] = [];
    let seatIdCounter = 1;

    const templates = {
        [RoomType.STANDARD]: {
            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
            seatsPerRow: [10, 10, 12, 12, 12, 12, 10, 10],
        },
        [RoomType.PREMIUM]: {
            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
            seatsPerRow: [8, 10, 12, 14, 14, 14, 14, 12, 10, 8],
        },
        [RoomType.IMAX]: {
            rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
            seatsPerRow: [12, 14, 16, 18, 20, 20, 20, 20, 18, 16, 14, 12],
        },
        [RoomType.VIP]: {
            rows: ['A', 'B', 'C', 'D', 'E', 'F'],
            seatsPerRow: [6, 6, 8, 8, 6, 6],
        },
    };

    const template = templates[roomType];
    const occupiedSeats = new Set([
        'A3', 'A4', 'B5', 'B6', 'D7', 'D8', 'F10', 'C6', 'C7',
        'E5', 'E6', 'E7', 'G8', 'G9'
    ]);

    template.rows.forEach((row, rowIndex) => {
        const seatsInRow = template.seatsPerRow[rowIndex];
        for (let seatNum = 1; seatNum <= seatsInRow; seatNum++) {
            const seatId = `${row}${seatNum}`;
            const isOccupied = occupiedSeats.has(seatId);

            seats.push({
                id: seatIdCounter++,
                screeningId,
                row,
                seatNumber: seatNum,
                isAvailable: !isOccupied,
                isReserved: isOccupied,
                seatType: 'STANDARD',
            });
        }
    });

    return seats;
};
