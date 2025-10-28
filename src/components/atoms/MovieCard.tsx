'use client';

import {Box} from "@mui/system";

interface CardProps {
    path: string;
    onClick: () => void;
}

export default function MovieCard({path, onClick}: Readonly<CardProps>) {
    return (
        <Box
            component="img"
            src={path}
            sx={{
                width: { xs: "100%", md: 300 },
                borderRadius: 3,
                boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease", // smooth hover effect
                "&:hover": {
                    transform: "scale(1.05)", // slightly bigger
                    boxShadow: "0 12px 30px rgba(0,0,0,0.8)", // deeper shadow
                },
            }}
            onClick={onClick}
        />
    )
}