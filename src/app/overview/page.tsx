'use client';

import {useEffect, useState} from "react";
import MovieCard from "@/components/atoms/MovieCard";
import {Grid, Typography, Box, Pagination} from "@mui/material";
import {MovieResponseDTO, getAllMovies, PageResponseDTO} from "@/service/movieService";
import '../globals.css';
import {useRouter} from "next/navigation";

export default function CinemaOverview() {
    const [movies, setMovies] = useState<MovieResponseDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const router = useRouter();

    const getImageUrl = (path?: string, size: string = "w500") =>
        path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.png";

    const fetchMovies = async (page: number) => {
        setLoading(true);
        try {
            const moviePage: PageResponseDTO<MovieResponseDTO> = await getAllMovies(page, 12, 'popularity', 'DESC');
            setMovies(moviePage.content);
            setCurrentPage(moviePage.pageNumber);
            setTotalPages(moviePage.totalPages);
        } catch (error) {
            console.error("Failed to fetch movies:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies(0);
    }, []);

    if (loading) {
        return (
            <Typography
                variant="h5"
                align="center"
                sx={{mt: 10, color: "white"}}
            >
                Loading movies...
            </Typography>
        );
    }

    return (
        <Box sx={{backgroundColor: "#36304E", minHeight: "100vh", py: 6, display: "flex", justifyContent: "center"}}>
            <Box sx={{p: 4, width: '100%', maxWidth: 1400}}>
                <Typography
                    variant="h3"
                    align="center"
                    gutterBottom
                    sx={{color: "white", mb: 6}}
                >
                    Now Showing 🎬
                </Typography>

                <Grid container spacing={4}>
                    {movies.map((movie) => (
                        <MovieCard
                            path={getImageUrl(movie.posterPath)}
                            onClick={() => router.push(`/movie/${movie.id}`)}
                        />
                    ))}
                </Grid>

                <Box sx={{display: "flex", justifyContent: "center", mt: 6}}>
                    <Pagination
                        count={totalPages}
                        page={currentPage + 1}
                        onChange={(event, value) => fetchMovies(value - 1)} // convert to 0-based
                        color="primary"
                    />
                </Box>
            </Box>
        </Box>
    );
}
