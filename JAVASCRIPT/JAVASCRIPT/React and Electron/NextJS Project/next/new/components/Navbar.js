import Link from 'next/link';

export default function Navbar() {
    const [user, username] = {};

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button>FEED</button>
                        </Link>
                </li>

                {}    
                // if user is logged in
                {user && (
                    <>
                    <li>
                        <Link href="/profile">
                            <button>PROFILE</button>
                        </Link>
                        <Link href="/logout">
                            <button>LOGOUT</button>
                        </Link>


                        
                    </li>
                    </>
                ))
                {  !user && (
                 
                )}
                </ul>
        </nav>
    );
}


                

            </ul>
