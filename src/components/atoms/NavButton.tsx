import {Button} from "@mui/material";
import Link from "next/link";

interface NavButtonProps {
    path: string;
    name: string;
}

const NavButton = ({ path, name }: NavButtonProps) => {
    return (
        <Button
            component={Link}
            href={path}
            color="inherit"
        >
            {name}
        </Button>
    );
};

export default NavButton;