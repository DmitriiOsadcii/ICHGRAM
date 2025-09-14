import { nanoid } from "nanoid"
import CreateIcon from "../components/IconsComponent/CreateIcon"
import ExploreIcon from "../components/IconsComponent/ExploreIcon"
import HomeIcon from "../components/IconsComponent/HomeIcon"
import MessageIcon from "../components/IconsComponent/MessageIcon"
import NotificationIcon from "../components/IconsComponent/NotificationIcon"
import SearchIcon from "../components/IconsComponent/SearchIcon"



const menuItems = [
    {
        id: nanoid(),
        href: "/main",
        text: "Home",
        icon: HomeIcon,
        
    },
    {
        id: nanoid(),
        href: "/search",
        text: "Search",
        icon: SearchIcon,
        openAsPanel: true,
    },
    {
        id: nanoid(),
        href: "/explore",
        text: "Explore",
        icon: ExploreIcon,
    },
    {
        id: nanoid(),
        href: "/messages",
        text: "Messages",
        icon: MessageIcon,
        openAsPanel: true,
    },
    {
        id: nanoid(),
        href: "/notifications",
        text: "Notificaitons",
        icon: NotificationIcon,
        openAsPanel: true,
    },
    {
        id: nanoid(),
        href: "/api/profile/create-post",
        text: "Create",
        icon: CreateIcon,
        type: "modal",
        modalType: "createPost",
    },
];

export default menuItems;