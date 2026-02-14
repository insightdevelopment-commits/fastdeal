import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const useAccessGuard = () => {
    const { isAuthenticated, openLoginModal } = useAuth();
    const navigate = useNavigate();

    const handleAccess = (path) => {
        if (isAuthenticated) {
            navigate(path);
        } else {
            openLoginModal(path);
        }
    };

    return { handleAccess };
};

export default useAccessGuard;
