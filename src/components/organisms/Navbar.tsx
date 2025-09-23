import {Box} from "@mui/system";
import {Typography} from "@mui/material";
import NavButton from "@/components/atoms/NavButton";


const Navbar = () => {
    return (
        <Box sx={{
            backgroundColor: "#595874",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Typography variant="h1" component="div">
                ABSOLUTE FILMORA
            </Typography>

            <NavButton path={"/"} name={"Home"}/>
        </Box>
    )
}

export default Navbar;