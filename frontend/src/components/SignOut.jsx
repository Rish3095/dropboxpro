import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function SignOut(props) {
    const [isSignedOut, setisSignedOut] = useState(false);
    return (
        <div>
            <Link to="/" onClick={() => {
                sessionStorage.clear()
                setisSignedOut(true)
            }}>
                LogOut
            </Link>
        </div>
    );
}

export default SignOut
