import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import User from '../User';
 
function Part1() {
    const navigate = useNavigate();
 
    useEffect(() => {
        const timeout = setTimeout(() => {
            navigate('/');
        }, 2000);
 
        // Clear the timeout if the component unmounts before the delay
        return () => clearTimeout(timeout);
    }, [navigate]);
 
    return (
        <div>
            {/* User create account */}
            <User />
        </div>
    );
}
 
export default Part1;