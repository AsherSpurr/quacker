import NavLinks from "./nav-links";

export default function Topnav() {
    return (
        <div className="flex h-full px-3 py-4 md:px-2">
            <div className="flex flex-col w-full">
                <NavLinks />
            </div>
         </div>
    )
}