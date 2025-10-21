'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // <-- import
import MovieCard from "@/components/atoms/MovieCard";
import { Grid, Typography, Box } from "@mui/material";
import { MovieResponseDTO, getAllMovies } from "@/service/movieService";
import '../globals.css';

export default function CinemaOverview() {
    const [movies, setMovies] = useState<MovieResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);

    const getImageUrl = (path?: string, size: string = "w500") =>
        path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.png";

    const router = useRouter();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const moviePage = await getAllMovies(0, 20);
                setMovies(moviePage.content);
            } catch (error) {
                console.error("Failed to fetch movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return (
            <Typography
                variant="h5"
                align="center"
                sx={{ mt: 10, color: "white" }}
            >
                Loading movies...
            </Typography>
        );
    }

    return (
        <Box sx={{
            backgroundColor: "#36304E",
            minHeight: "100vh",
            py: 6,
            display: "flex",
            justifyContent: "center"
        }}>
            <Box sx={{ p: 4, width: '100%', maxWidth: 1400 }}>
                <Typography
                    variant="h3"
                    align="center"
                    gutterBottom
                    sx={{ color: "white", mb: 6 }}
                >
                    Now Showing 🎬
                </Typography>

                <Grid container spacing={4}>
                    {movies.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                path={getImageUrl(movie.posterPath)}
                                onClick={() => router.push(`/movie/${movie.id}`)}
                            />
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}
