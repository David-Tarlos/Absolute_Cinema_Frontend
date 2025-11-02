// src/utils/roomTemplates.ts
import { RoomType } from '../service/screeningService';

export interface RoomLayout {
    rows: string[];
    seatsPerRow: number[];
    aisles?: number[]; // Seats after which there's an aisle
    vipRows?: string[]; // VIP rows
    wheelchairSeats?: string[]; // Wheelchair accessible seats
}

export const ROOM_TEMPLATES: Record<RoomType, RoomLayout> = {
    [RoomType.STANDARD]: {
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
        seatsPerRow: [10, 10, 12, 12, 12, 12, 10, 10],
        aisles: [5],
        wheelchairSeats: ['A1', 'A10', 'H1', 'H10'],
    },
    [RoomType.PREMIUM]: {
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        seatsPerRow: [8, 10, 12, 14, 14, 14, 14, 12, 10, 8],
        aisles: [4, 10],
        wheelchairSeats: ['A1', 'A8', 'J1', 'J8'],
    },
    [RoomType.IMAX]: {
        rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'],
        seatsPerRow: [12, 14, 16, 18, 20, 20, 20, 20, 18, 16, 14, 12],
        aisles: [6, 14],
        wheelchairSeats: ['A1', 'A12', 'L1', 'L12'],
    },
    [RoomType.VIP]: {
        rows: ['A', 'B', 'C', 'D', 'E', 'F'],
        seatsPerRow: [6, 6, 8, 8, 6, 6],
        aisles: [3],
        vipRows: ['C', 'D', 'E'],
        wheelchairSeats: ['A1', 'A6'],
    },
};

export const getRoomTemplate = (roomType: RoomType): RoomLayout => {
    return ROOM_TEMPLATES[roomType];
};

export const getTotalSeats = (roomType: RoomType): number => {
    const template = ROOM_TEMPLATES[roomType];
    return template.seatsPerRow.reduce((sum, seats) => sum + seats, 0);
};

export const isWheelchairSeat = (seatId: string, roomType: RoomType): boolean => {
    const template = ROOM_TEMPLATES[roomType];
    return template.wheelchairSeats?.includes(seatId) || false;
};

export const isVipRow = (row: string, roomType: RoomType): boolean => {
    const template = ROOM_TEMPLATES[roomType];
    return template.vipRows?.includes(row) || false;
};
