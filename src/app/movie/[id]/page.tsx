"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Box,
    Typography,
    Container,
    Rating,
    Chip,
    Stack,
    CircularProgress,
    Avatar,
    Card,
    CardContent,
} from "@mui/material";
import { MovieResponseDTO, getMovieById } from "@/service/movieService";
import { CastDto, getCastByMovieId } from "@/service/castService";

// Helper to build full image URL from TMDb path
const getImageUrl = (path?: string, size: string = "w500") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.png";

// CastCard component
const CastCard = ({ actor }: { actor: CastDto }) => (
    <Card
        sx={{
            width: 140,
            bgcolor: "#121212",
            color: "#fff",
            border: "1px solid #333",
            textAlign: "center",
        }}
    >
        <Avatar
            src={getImageUrl(actor.profilePath)}
            alt={actor.name}
            sx={{ width: 120, height: 120, mx: "auto", mt: 1 }}
        />
        <CardContent sx={{ p: 1 }}>
            <Typography variant="body2" fontWeight="bold">
                {actor.name}
            </Typography>
            {actor.character && (
                <Typography variant="caption" color="gray">
                    as {actor.character}
                </Typography>
            )}
        </CardContent>
    </Card>
);

const MovieDetailPage = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState<MovieResponseDTO | null>(null);
    const [cast, setCast] = useState<CastDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                const movieData = await getMovieById(Number(id));
                setMovie(movieData);

                const castData = await getCastByMovieId(Number(id));
                setCast(castData.sort((a, b) => (a.creditOrder ?? 0) - (b.creditOrder ?? 0)));
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress />
            </Box>
        );

    if (!movie)
        return (
            <Typography textAlign="center" mt={10}>
                Movie not found.
            </Typography>
        );

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#0d0d0d", color: "#fff", py: 6 }}>
            <Container maxWidth="lg">
                {/* Backdrop */}
                {movie.backdropPath && (
                    <Box
                        component="img"
                        src={getImageUrl(movie.backdropPath, "original")}
                        alt={movie.title}
                        sx={{
                            width: "100%",
                            maxHeight: 400,
                            objectFit: "cover",
                            borderRadius: 2,
                            mb: 4,
                            filter: "brightness(0.6)",
                        }}
                    />
                )}

                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4 }}>
                    {/* Poster */}
                    {movie.posterPath && (
                        <Box
                            component="img"
                            src={getImageUrl(movie.posterPath)}
                            alt={movie.title}
                            sx={{
                                width: { xs: "100%", md: 300 },
                                borderRadius: 3,
                                boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
                            }}
                        />
                    )}

                    {/* Movie Info */}
                    <Box flex="1">
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            {movie.title}
                        </Typography>

                        <Stack direction="row" spacing={2} flexWrap="wrap" mb={2}>
                            {movie.genres?.map((genre) => (
                                <Chip
                                    key={genre.id}
                                    label={genre.name}
                                    sx={{ bgcolor: "#1a1a1a", color: "#90caf9", border: "1px solid #1976d2" }}
                                />
                            ))}
                        </Stack>

                        <Stack direction="row" spacing={2} mb={2} flexWrap="wrap">
                            {movie.releaseDate && (
                                <Typography variant="body2" color="gray">
                                    Released: {new Date(movie.releaseDate).toLocaleDateString()}
                                </Typography>
                            )}
                            {movie.runtime && (
                                <Typography variant="body2" color="gray">
                                    Runtime: {movie.runtime} min
                                </Typography>
                            )}
                            {movie.status && (
                                <Typography variant="body2" color="gray">
                                    Status: {movie.status}
                                </Typography>
                            )}
                            {movie.originalLanguage && (
                                <Typography variant="body2" color="gray">
                                    Language: {movie.originalLanguage.toUpperCase()}
                                </Typography>
                            )}
                            {movie.popularity && (
                                <Typography variant="body2" color="gray">
                                    Popularity: {Math.round(movie.popularity)}
                                </Typography>
                            )}
                        </Stack>

                        <Stack direction="row" alignItems="center" spacing={1} mb={3}>
                            {movie.voteAverage !== undefined && (
                                <>
                                    <Rating value={movie.voteAverage / 2} precision={0.5} readOnly sx={{ color: "#ffb400" }} />
                                    <Typography variant="body1">{movie.voteAverage}/10</Typography>
                                </>
                            )}
                        </Stack>

                        {movie.overview && (
                            <Typography variant="body1" color="gray.300" mb={4}>
                                {movie.overview}
                            </Typography>
                        )}

                        {/* Cast Section */}
                        {cast.length > 0 && (
                            <>
                                <Typography variant="h5" fontWeight="bold" mb={2}>
                                    Cast
                                </Typography>
                                <Stack direction="row" spacing={2} overflow="auto" sx={{ pb: 2 }}>
                                    {cast.map((actor) => (
                                        <CastCard key={actor.id} actor={actor} />
                                    ))}
                                </Stack>
                            </>
                        )}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default MovieDetailPage;
