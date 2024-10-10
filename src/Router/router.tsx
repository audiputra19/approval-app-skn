import { FC } from "react";
import { useRoutes } from "react-router-dom";
import Home from "../Pages/home";
import { PinAccess } from "../Pages/pinAccess";
import { ProtectedRouter } from "./protectedRouter";

export const Router: FC = () => {
    let element = [
        {
            path: "/",
            element: <ProtectedRouter><Home/></ProtectedRouter>
        },
        {
            path: "/pin-access",
            element: <PinAccess/>
        }
    ];

    let routes = useRoutes(element);

    return routes;
}