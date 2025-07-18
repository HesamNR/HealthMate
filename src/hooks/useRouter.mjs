// src/hooks/useRouter.js
import { useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';

export function useRouter() {
  const navigate      = useNavigate();
  const location      = useLocation();
  const params        = useParams();
  const [searchParams]= useSearchParams();

  return {
    navigate,
    location,
    params,
    query: Object.fromEntries(searchParams.entries()),
  };
}
