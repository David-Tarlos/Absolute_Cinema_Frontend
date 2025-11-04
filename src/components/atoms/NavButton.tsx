import { ArrowLeft } from "@mui/icons-material";
import {Button, IconButton} from "@mui/material";
import Link from "next/link";

interface NavButtonProps {
    path: string;
    name: string;
}

const NavButton = ({ path, name }: NavButtonProps) => {
    return name === "<-" ? (
        <IconButton
            component={Link}
            href={path}
            sx={{
                color: "#fff",
                bgcolor: "rgba(211,211,211,0.2)",
                "&:hover": { bgcolor: "rgba(211,211,211,0.4)" },
            }}
        >
            <ArrowLeft />
        </IconButton>
    ) : (
        <Button
            component={Link}
            href={path}
            color="inherit"
            sx={{
                padding: "1rem",
                backgroundColor: "rgba(211, 211, 211, 0.7)",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "rgba(211,211,211,0.9)" },
            }}
        >
            {name}
        </Button>
    );
};

export default NavButton;