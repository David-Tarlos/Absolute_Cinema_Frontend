import {Box} from "@mui/system";
import {Typography} from "@mui/material";
import NavButton from "@/components/atoms/NavButton";

interface NavbarProps {
    details?: boolean;
}

const Navbar = ({ details = false }: NavbarProps) => {
    return (
        <Box
            sx={{
                backgroundColor: "rgba(89, 88, 116, 0.95)",
                height: "100px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingRight: "100px",
                paddingLeft: "100px",
                position: "sticky",
                top: 0,
                zIndex: 999,
                width: "100%",
                boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
        >
            <Typography
                variant="h3"
                sx={{color: "#fff", fontWeight: "bold", userSelect: "none"}}
            >
                ABSOLUTE FILMORA
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                }}
            >
                {details ? (
                    <NavButton path="/overview" name="<-" />
                ) : (
                    <>
                        <NavButton path="/" name="Home" />
                        <NavButton path="/overview" name="Movies" />
                    </>
                )}
            </Box>
        </Box>
    );
};

export default Navbar;
