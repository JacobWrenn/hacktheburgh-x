import { HomeIcon } from "@heroicons/react/24/solid";
import { ListBulletIcon } from "@heroicons/react/24/solid";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { GlobeEuropeAfricaIcon } from "@heroicons/react/24/solid";
import { usePathname, useRouter } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const routes = [
    {
      path: "/",
      classes: "",
      icon: <HomeIcon className="h-7 w-7 text-black" />,
    },
    {
      path: "/lrd",
      classes: "",
      icon: <ListBulletIcon className="h-7 w-7 text-black" />,
    },
    {
      path: "/scanphoto",
      classes: "verYroundbox",
      icon: <GlobeEuropeAfricaIcon className="globe" />,
    },
    {
      path: "/clan",
      classes: "",
      icon: <UserGroupIcon className="h-7 w-7 text-black" />,
    },
    {
      path: "/profile",
      classes: "",
      icon: <UserCircleIcon className="h-7 w-7 text-black" />,
    },
  ];

  function getClasses(common: string, path: string, active: string) {
    if (pathname === path) return common + " " + active;
    return common;
  }

  return (
    <ul className="flex justify-around h-14 p-4 bg-gradient-to-r from-cyan-50 via-slate-400 to-cyan-100 text-black">
      {routes.map(({ path, icon, classes }) => (
        <li
          key={path}
          onClick={() => router.push(path)}
          className={getClasses(
            classes + " cursor-pointer",
            path,
            "bg-gray-300 rounded-xl"
          )}
        >
          {icon}
        </li>
      ))}
    </ul>
  );
}
