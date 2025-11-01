'use client';

import { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, CircularProgress, Alert } from "@mui/material";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import '../../globals.css';
import { getMovieById, MovieResponseDTO } from "@/service/movieService";
import {
    getScreeningsByMovie,
    getSeatsByScreening,
    createReservation,
    ScreeningResponseDTO,
    SeatResponseDTO,
    RoomType
} from "@/service/screeningService";
import { getRoomTemplate, isWheelchairSeat } from "@/utils/roomTemplates";
import ShowtimeSelector from "@/components/organisms/ShowtimeSelector";

interface SeatProps {
    id: string;
    seatNumber: number;
    status: 'available' | 'selected' | 'occupied';
    isWheelchair?: boolean;
    onClick: () => void;
}

function Seat({ id, seatNumber, status, isWheelchair, onClick }: SeatProps) {
    const getColor = () => {
        switch (status) {
            case 'available':
                return '#4CAF50';
            case 'selected':
                return '#2196F3';
            case 'occupied':
                return '#9E9E9E';
        }
    };

    return (
        <Box
            onClick={status !== 'occupied' ? onClick : undefined}
            sx={{
                width: 40,
                height: 40,
                backgroundColor: getColor(),
                borderRadius: '8px',
                cursor: status !== 'occupied' ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'white',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                border: isWheelchair ? '2px solid #FFC107' : 'none',
                '&:hover': status !== 'occupied' ? {
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                } : {},
            }}
        >
            {seatNumber}
        </Box>
    );
}

export default function ReservationPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const movieId = searchParams.get('movieId');

    const [movie, setMovie] = useState<MovieResponseDTO | null>(null);
    const [screenings, setScreenings] = useState<ScreeningResponseDTO[]>([]);
    const [selectedScreening, setSelectedScreening] = useState<ScreeningResponseDTO | null>(null);
    const [seats, setSeats] = useState<SeatResponseDTO[]>([]);
    const [selectedSeats, setSelectedSeats] = useState<SeatResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    // Fetch movie and screenings
    useEffect(() => {
        const fetchData = async () => {
            if (!movieId) {
                setError("No movie ID provided");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Try to get the actual movie first
                const movieData = await getMovieById(Number(movieId));
                setMovie(movieData);

                // Try to get screenings
                try {
                    const screeningsData = await getScreeningsByMovie(Number(movieId));
                    setScreenings(screeningsData);
                } catch (screeningErr) {
                    console.error("Screenings API Error:", screeningErr);
                    // Use mock screenings but with the real movie
                    const { mockScreenings } = await import('@/utils/mockData');
                    const adjustedScreenings = mockScreenings.map(s => ({
                        ...s,
                        movieId: movieData.id,
                        movie: movieData
                    }));
                    setScreenings(adjustedScreenings);
                    setError("Screenings not available from backend - using mock showtimes for demonstration");
                }
            } catch (err) {
                console.error("Movie API Error:", err);
                setError("Failed to load movie data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [movieId]);

    // Fetch seats when screening is selected
    useEffect(() => {
        const fetchSeats = async () => {
            if (!selectedScreening) return;

            try {
                const seatsData = await getSeatsByScreening(selectedScreening.id);
                setSeats(seatsData);
                setSelectedSeats([]);
            } catch (err) {
                console.error("Seats API Error:", err);
                // Fallback to mock seats
                const { generateMockSeats } = await import('@/utils/mockData');
                const mockSeats = generateMockSeats(selectedScreening.id, selectedScreening.roomType);
                setSeats(mockSeats);
                setSelectedSeats([]);
            }
        };

        fetchSeats();
    }, [selectedScreening]);

    const toggleSeat = (seat: SeatResponseDTO) => {
        if (seat.isReserved || !seat.isAvailable) return;

        setSelectedSeats(prev => {
            const isSelected = prev.find(s => s.id === seat.id);
            if (isSelected) {
                return prev.filter(s => s.id !== seat.id);
            } else {
                return [...prev, seat];
            }
        });
    };

    const getSeatStatus = (seat: SeatResponseDTO): 'available' | 'selected' | 'occupied' => {
        if (seat.isReserved || !seat.isAvailable) return 'occupied';
        if (selectedSeats.find(s => s.id === seat.id)) return 'selected';
        return 'available';
    };

    const handleBooking = async () => {
        if (!selectedScreening || selectedSeats.length === 0 || !movie) return;

        // Redirect to payment page with booking details
        const seatsList = selectedSeats.map(s => `${s.row}${s.seatNumber}`).join(', ');
        const params = new URLSearchParams({
            movieTitle: movie.title,
            seats: seatsList,
            total: totalPrice.toFixed(2),
            screeningTime: selectedScreening.screeningTime,
            roomNumber: selectedScreening.roomNumber.toString(),
        });

        router.push(`/overview/payment?${params.toString()}`);
    };

    const totalPrice = selectedScreening
        ? selectedSeats.length * selectedScreening.price
        : 0;

    if (loading && !movie) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#36304E' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error && !movie) {
        return (
            <Box sx={{ backgroundColor: '#36304E', minHeight: '100vh', p: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!movie) return null;

    // Get room layout for selected screening
    const roomLayout = selectedScreening
        ? getRoomTemplate(selectedScreening.roomType)
        : null;

    return (
        <Box sx={{
            backgroundColor: "#36304E",
            minHeight: "100vh",
            padding: 4,
        }}>
            <Grid container spacing={4}>
                {/* Left Side - Movie Info (sticky) */}
                <Grid item xs={12} md={3}>
                    <Box sx={{
                        backgroundColor: "white",
                        borderRadius: 3,
                        padding: 3,
                        position: 'sticky',
                        top: 20,
                        maxWidth: '100%',
                        maxHeight: '90vh',
                        overflow: 'auto',
                    }}>
                        <Image
                            src={movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : '/absolute_filmora.png'}
                            alt={movie.title}
                            width={300}
                            height={450}
                            style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '12px',
                                marginBottom: '12px',
                            }}
                        />
                        <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ color: 'black' }}>
                            {movie.title}
                        </Typography>

                        {selectedScreening && (
                            <Typography variant="caption" sx={{ color: 'black', mb: 0.5, display: 'block' }}>
                                {new Date(selectedScreening.screeningTime).toLocaleDateString()} • {new Date(selectedScreening.screeningTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </Typography>
                        )}

                        {selectedScreening && (
                            <Typography variant="caption" sx={{ color: 'black', display: 'block', mb: 1 }}>
                                Room {selectedScreening.roomNumber} • ${selectedScreening.price.toFixed(2)}
                            </Typography>
                        )}

                        {selectedSeats.length > 0 && (
                            <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid #eee' }}>
                                <Typography variant="caption" sx={{ color: 'black', display: 'block', mb: 0.5 }}>
                                    Seats: {selectedSeats.map(s => `${s.row}${s.seatNumber}`).join(', ')}
                                </Typography>

                                <Typography variant="body1" fontWeight="bold" sx={{ mb: 1, color: 'black' }}>
                                    Total: ${totalPrice.toFixed(2)}
                                </Typography>

                                {bookingSuccess && (
                                    <Alert severity="success" sx={{ mb: 0.5, py: 0, fontSize: '0.75rem' }}>
                                        Booked!
                                    </Alert>
                                )}

                                <Button
                                    variant="contained"
                                    fullWidth
                                    disabled={loading}
                                    sx={{
                                        backgroundColor: '#4CAF50',
                                        '&:hover': {
                                            backgroundColor: '#45a049',
                                        },
                                        padding: '8px',
                                        fontSize: '13px',
                                        fontWeight: 'bold',
                                    }}
                                    onClick={handleBooking}
                                >
                                    {loading ? <CircularProgress size={18} /> : 'Book'}
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Grid>

                {/* Right Side - Showtime Selection & Seat Selection */}
                <Grid item xs={12} md={9}>
                    {/* Showtime Selector */}
                    <Box sx={{
                        backgroundColor: "white",
                        borderRadius: 3,
                        padding: 4,
                        mb: 3,
                    }}>
                        <ShowtimeSelector
                            screenings={screenings}
                            selectedScreeningId={selectedScreening?.id}
                            onSelectScreening={setSelectedScreening}
                        />
                    </Box>

                    {/* Seat Selection */}
                    {selectedScreening && roomLayout && (
                        <Box sx={{
                            backgroundColor: "white",
                            borderRadius: 3,
                            padding: 4,
                        }}>
                            <Typography variant="h4" align="center" gutterBottom fontWeight="bold" sx={{ color: 'black' }}>
                                Select Your Seats
                            </Typography>

                            {/* Screen */}
                            <Box sx={{
                                width: '80%',
                                margin: '0 auto 40px',
                                height: '10px',
                                backgroundColor: '#FFD700',
                                borderRadius: '50%',
                                boxShadow: '0 4px 8px rgba(255, 215, 0, 0.5)',
                            }} />
                            <Typography variant="caption" align="center" display="block" sx={{ mb: 4, color: 'black' }}>
                                SCREEN
                            </Typography>

                            {/* Seats Grid */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
                                {roomLayout.rows.map((row, rowIndex) => {
                                    const rowSeats = seats.filter(s => s.row === row);
                                    return (
                                        <Box key={row} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Typography sx={{ width: 30, fontWeight: 'bold', color: 'black' }}>
                                                {row}
                                            </Typography>
                                            {rowSeats.map(seat => {
                                                const seatId = `${seat.row}${seat.seatNumber}`;
                                                const isWheelchair = isWheelchairSeat(seatId, selectedScreening.roomType);
                                                return (
                                                    <Seat
                                                        key={seat.id}
                                                        id={seatId}
                                                        seatNumber={seat.seatNumber}
                                                        status={getSeatStatus(seat)}
                                                        isWheelchair={isWheelchair}
                                                        onClick={() => toggleSeat(seat)}
                                                    />
                                                );
                                            })}
                                        </Box>
                                    );
                                })}
                            </Box>

                            {/* Legend */}
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mt: 4, flexWrap: 'wrap' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 24, height: 24, backgroundColor: '#4CAF50', borderRadius: '4px' }} />
                                    <Typography variant="body2" sx={{ color: 'black' }}>Available</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 24, height: 24, backgroundColor: '#2196F3', borderRadius: '4px' }} />
                                    <Typography variant="body2" sx={{ color: 'black' }}>Selected</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 24, height: 24, backgroundColor: '#9E9E9E', borderRadius: '4px' }} />
                                    <Typography variant="body2" sx={{ color: 'black' }}>Occupied</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 24, height: 24, backgroundColor: '#4CAF50', borderRadius: '4px', border: '2px solid #FFC107' }} />
                                    <Typography variant="body2" sx={{ color: 'black' }}>Wheelchair</Typography>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
}
