"use client";

import { useEffect, useState, useRef } from "react";
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
    IconButton,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { MovieResponseDTO, getMovieById } from "@/service/movieService";
import { CastDto, getCastByMovieId } from "@/service/castService";

const getImageUrl = (path?: string, size: string = "w500") =>
    path ? `https://image.tmdb.org/t/p/${size}${path}` : "/placeholder.png";

const CastCard = ({ actor }: { actor: CastDto }) => (
    <Card
        sx={{
            width: 140,
            bgcolor: "#121212",
            color: "#fff",
            border: "1px solid #333",
            textAlign: "center",
            transition: "transform 0.3s",
            "&:hover": { transform: "scale(1.05)", boxShadow: "0 8px 20px rgba(255,255,255,0.1)" },
        }}
    >
        <Avatar
            src={getImageUrl(actor.profilePath)}
            alt={actor.name}
            sx={{ width: 120, height: 120, mx: "auto", mt: 1, border: "2px solid #1976d2" }}
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
    const castContainerRef = useRef<HTMLDivElement>(null);

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

    const scrollCast = (direction: "left" | "right") => {
        if (!castContainerRef.current) return;
        const container = castContainerRef.current;
        const scrollAmount = container.clientWidth * 0.8; // scroll ~80% of visible width
        container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    };

    if (loading)
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress color="secondary" />
            </Box>
        );

    if (!movie)
        return (
            <Typography textAlign="center" mt={10}>
                Movie not found.
            </Typography>
        );

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: "#0d0d0d", color: "#fff", pb: 6 }}>
            <Container maxWidth="lg">
                {/* Backdrop */}
                {movie.backdropPath && (
                    <Box sx={{ position: "relative", borderRadius: 2, overflow: "hidden", mb: 6 }}>
                        <Box
                            component="img"
                            src={getImageUrl(movie.backdropPath, "original")}
                            alt={movie.title}
                            sx={{ width: "100%", maxHeight: 450, objectFit: "cover", filter: "brightness(0.5)" }}
                        />
                        <Box sx={{ position: "absolute", bottom: 16, left: 16, color: "#fff" }}>
                            <Typography variant="h2" fontWeight="bold">
                                {movie.title}
                            </Typography>
                            {movie.releaseDate && (
                                <Typography variant="body1" color="gray.300">
                                    {new Date(movie.releaseDate).toLocaleDateString()}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                )}

                {/* Movie Info */}
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, mb: 4 }}>
                    {movie.posterPath && (
                        <Box sx={{ width: { xs: "100%", md: 300 }, flexShrink: 0 }}>
                            <CastCard actor={{ name: movie.title, profilePath: movie.posterPath, id: -1 }} />
                        </Box>
                    )}

                    <Box flex="1">
                        <Stack spacing={2}>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {movie.genres?.map((genre) => (
                                    <Chip
                                        key={genre.id}
                                        label={genre.name}
                                        sx={{ bgcolor: "#1a1a1a", color: "#90caf9", border: "1px solid #1976d2" }}
                                    />
                                ))}
                            </Stack>

                            <Stack direction="row" spacing={2} flexWrap="wrap" color="gray.400">
                                {movie.runtime && <Typography>Runtime: {movie.runtime} min</Typography>}
                                {movie.status && <Typography>Status: {movie.status}</Typography>}
                                {movie.originalLanguage && (
                                    <Typography>Language: {movie.originalLanguage.toUpperCase()}</Typography>
                                )}
                                {movie.popularity && <Typography>Popularity: {Math.round(movie.popularity)}</Typography>}
                            </Stack>

                            {movie.voteAverage !== undefined && (
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Rating value={movie.voteAverage / 2} precision={0.5} readOnly sx={{ color: "#ffb400" }} />
                                    <Typography>{movie.voteAverage}/10</Typography>
                                </Stack>
                            )}

                            {movie.overview && (
                                <Typography variant="body1" color="gray.300">
                                    {movie.overview}
                                </Typography>
                            )}
                        </Stack>
                    </Box>
                </Box>

                {cast.length > 0 && (
                    <Box sx={{ py: 4, position: "relative" }}>
                        <Typography variant="h5" fontWeight="bold" mb={2}>
                            Cast
                        </Typography>

                        {/* Left Arrow */}
                        <IconButton
                            onClick={() => scrollCast("left")}
                            sx={{
                                position: "absolute",
                                left: 0,
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: 10,
                                bgcolor: "rgba(0,0,0,0.5)",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                            }}
                        >
                            <ArrowBackIos sx={{ color: "#fff" }} />
                        </IconButton>

                        {/* Cast Cards Container */}
                        <Box
                            ref={castContainerRef}
                            sx={{
                                display: "flex",
                                gap: 2,
                                overflowX: "auto",
                                scrollBehavior: "smooth",
                                px: 6,
                                /* Hide scrollbar */
                                "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari
                                scrollbarWidth: "none", // Firefox
                            }}
                        >
                            {cast.map((actor) => (
                                <Box key={actor.id} sx={{ flex: "0 0 auto", scrollSnapAlign: "start" }}>
                                    <CastCard actor={actor} />
                                </Box>
                            ))}
                        </Box>

                        {/* Right Arrow */}
                        <IconButton
                            onClick={() => scrollCast("right")}
                            sx={{
                                position: "absolute",
                                right: 0,
                                top: "50%",
                                transform: "translateY(-50%)",
                                zIndex: 10,
                                bgcolor: "rgba(0,0,0,0.5)",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                            }}
                        >
                            <ArrowForwardIos sx={{ color: "#fff" }} />
                        </IconButton>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default MovieDetailPage;
