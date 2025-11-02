'use client';

import { Box, Typography, Button, Chip, Grid } from "@mui/material";
import { ScreeningResponseDTO, RoomType } from "@/service/screeningService";

interface ShowtimeSelectorProps {
    screenings: ScreeningResponseDTO[];
    selectedScreeningId?: number;
    onSelectScreening: (screening: ScreeningResponseDTO) => void;
}

const getRoomTypeLabel = (roomType: RoomType): string => {
    const labels = {
        [RoomType.STANDARD]: 'Standard',
        [RoomType.PREMIUM]: 'Premium',
        [RoomType.IMAX]: 'IMAX',
        [RoomType.VIP]: 'VIP',
    };
    return labels[roomType];
};

const getRoomTypeColor = (roomType: RoomType): string => {
    const colors = {
        [RoomType.STANDARD]: '#4CAF50',
        [RoomType.PREMIUM]: '#2196F3',
        [RoomType.IMAX]: '#FF9800',
        [RoomType.VIP]: '#9C27B0',
    };
    return colors[roomType];
};

export default function ShowtimeSelector({
    screenings,
    selectedScreeningId,
    onSelectScreening,
}: ShowtimeSelectorProps) {
    // Group screenings by date
    const groupedByDate = screenings.reduce((acc, screening) => {
        const date = new Date(screening.screeningTime).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
        });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(screening);
        return acc;
    }, {} as Record<string, ScreeningResponseDTO[]>);

    return (
        <Box sx={{ mb: 4 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: 'black' }}>
                Select Showtime
            </Typography>

            {Object.entries(groupedByDate).map(([date, dateScreenings]) => (
                <Box key={date} sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'black', fontWeight: 'bold' }}>
                        {date}
                    </Typography>
                    <Grid container spacing={2}>
                        {dateScreenings.map((screening) => {
                            const time = new Date(screening.screeningTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false,
                            });
                            const isSelected = selectedScreeningId === screening.id;
                            const isSoldOut = screening.availableSeats === 0;

                            return (
                                <Grid item key={screening.id} xs={12} sm={6} md={4}>
                                    <Button
                                        variant={isSelected ? 'contained' : 'outlined'}
                                        fullWidth
                                        disabled={isSoldOut}
                                        onClick={() => onSelectScreening(screening)}
                                        sx={{
                                            p: 2,
                                            borderColor: isSelected
                                                ? getRoomTypeColor(screening.roomType)
                                                : '#ddd',
                                            backgroundColor: isSelected
                                                ? getRoomTypeColor(screening.roomType)
                                                : 'transparent',
                                            color: isSelected ? 'white' : 'black',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'flex-start',
                                            textTransform: 'none',
                                            '&:hover': {
                                                backgroundColor: isSelected
                                                    ? getRoomTypeColor(screening.roomType)
                                                    : 'rgba(0,0,0,0.05)',
                                                borderColor: getRoomTypeColor(screening.roomType),
                                            },
                                            '&.Mui-disabled': {
                                                backgroundColor: '#f5f5f5',
                                                color: '#999',
                                            },
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                mb: 1,
                                            }}
                                        >
                                            <Typography variant="h6" fontWeight="bold">
                                                {time}
                                            </Typography>
                                            <Chip
                                                label={getRoomTypeLabel(screening.roomType)}
                                                size="small"
                                                sx={{
                                                    backgroundColor: isSelected
                                                        ? 'rgba(255,255,255,0.3)'
                                                        : getRoomTypeColor(screening.roomType),
                                                    color: 'white',
                                                    fontWeight: 'bold',
                                                }}
                                            />
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                            }}
                                        >
                                            <Typography variant="body2">
                                                Room {screening.roomNumber}
                                            </Typography>
                                            <Typography variant="body2">
                                                {isSoldOut
                                                    ? 'SOLD OUT'
                                                    : `${screening.availableSeats} seats left`}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            sx={{ mt: 1, alignSelf: 'flex-end' }}
                                        >
                                            ${screening.price.toFixed(2)}
                                        </Typography>
                                    </Button>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Box>
            ))}

            {screenings.length === 0 && (
                <Typography variant="body1" sx={{ color: 'black', textAlign: 'center', py: 4 }}>
                    No showtimes available for this movie.
                </Typography>
            )}
        </Box>
    );
}
