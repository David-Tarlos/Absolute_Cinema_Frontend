'use client';

import {Box} from "@mui/system";
import Image, {StaticImageData} from "next/image";
import {Typography} from "@mui/material";

interface CardProps {
    path: string | StaticImageData;
    title: string;
    onClick: () => void;
}

export default function MovieCard({path, title, onClick}: Readonly<CardProps>) {
    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "5px",
            padding: "10px",
            border: "1px solid black",
            borderRadius: "25px",
            backgroundColor: "white",
        }}
             onClick={onClick}
        >
            <Image src={path} alt={title + "-image"} width={200} height={200} />
            <Typography variant="h6" component="div" color={"textSecondary"}>
                {title}
            </Typography>

        </Box>

    );
}
