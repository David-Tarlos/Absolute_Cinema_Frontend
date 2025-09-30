'use client';

import Navbar from "@/components/organisms/Navbar";
import {Box} from "@mui/system";
import Image from "next/image";
import AbsoluteFilmora from "@/assets/AbsoluteFilmora.png";

export default function Home() {
    return (
        <>
            <Navbar/>
            <Box sx={{
                backgroundColor: "#36304E",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <Image src={AbsoluteFilmora} alt="Absolute Filmora" />
            </Box>
        </>

    );
}
