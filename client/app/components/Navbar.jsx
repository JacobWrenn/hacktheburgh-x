import {HomeIcon} from '@heroicons/react/24/solid';
import { ListBulletIcon } from '@heroicons/react/24/solid';
import { UserGroupIcon } from '@heroicons/react/24/solid';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { GlobeEuropeAfricaIcon } from '@heroicons/react/24/solid';

import { GlobeAsiaAustraliaIcon } from '@heroicons/react/24/solid';
import { GlobeAmericasIcon } from '@heroicons/react/24/solid';

export default function Navbar() {
  return (

    <ul className="flex justify-around h-14 p-4 bg-gradient-to-r from-cyan-50 via-slate-400 to-cyan-100 text-black">
      <li>
        <HomeIcon className="h-7 w-7 text-black"/>
      </li> {/*Home*/}
      <li>
        <ListBulletIcon className="h-7 w-7 text-black"/>
      </li> {/*soc*/}

      <li className="verYroundbox">
        <GlobeEuropeAfricaIcon className="globe"/>
      </li> {/*Add points*/}

      <li>
        <UserGroupIcon className="h-7 w-7 text-black"/>
      </li> {/*leader board*/}
      <li>
        <UserCircleIcon className="h-7 w-7 text-black"/>
      </li> {/*Profile*/}

    </ul>

  );
}
