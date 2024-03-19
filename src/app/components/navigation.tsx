import Image from "next/image";
import Link from "next/link";

type NavbarProps = {
  showLogout: boolean,
  onLogoutClicked: () => void,
};

export default function Navbar({ showLogout, onLogoutClicked }: NavbarProps) {
  return (
    <div className="w-screen border-b-2 border-grey">
      <div className="max-w-6xl py-4 px-8 md:px-12 sm:px-24 text-dark flex justify-between mx-auto">
        <Image
          src="/images/logo.png"
          width={ 134 }
          height={ 22 }
          alt=""
        />
        <div className="flex gap-x-8">
          <Link
            href="/privacy-policy"
          >
            Privacy Policy
          </Link>
          { showLogout &&
            <button
              onClick={ onLogoutClicked }
              className=""
            >
              Logout
            </button>
          }
        </div>
      </div>
    </div>
  )
}
