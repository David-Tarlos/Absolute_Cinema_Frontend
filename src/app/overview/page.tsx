'use client';

import { useEffect, useState } from "react";
import MovieCard from "@/components/atoms/MovieCard";
import { Grid, Typography } from "@mui/material";
import {Box} from "@mui/system";
import '../globals.css';

interface Movie {
    id: number;
    title: string;
    poster: string;
    overview: string;
    releaseDate: string;
    showtimes: string[];
    price: number;
    availableSeats: number;
}

export default function CinemaOverview() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMovies() {
            try {
                const res = await fetch("http://localhost:5000/movies/now_playing");
                const data = await res.json();
                setMovies(data.results || []);
            } catch (err) {
                console.error("Error fetching movies", err);
            } finally {
                setLoading(false);
            }
        }
        fetchMovies();
    }, []);

    if (loading) {
        return <Typography variant="h5" align="center" sx={{ mt: 10 }}>Loading movies...</Typography>;
    }

    return (
        <Box sx={{
            backgroundColor: "#36304E",
            height: "100vh",
            display: "flex",
            justifyContent: "center",

        }}>
        <Box sx={{ p: 4 }}>
            <Typography variant="h3" align="center" gutterBottom>Now Showing 🎬</Typography>
            <Grid container spacing={4} justifyContent="center">
                {movies.map((movie) => (
                    <Grid item key={movie.id}>
                        <MovieCard
                            path={movie.poster}
                            title={movie.title}
                            onClick={() => {
                                alert(`Selected: ${movie.title}\nShowtimes: ${movie.showtimes.join(", ")}`);
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
        </Box>
    );
}
