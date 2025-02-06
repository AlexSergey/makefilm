import { Outlet } from 'react-router-dom';

export const MainPage = () => {
  return (
    <div>
      <h2>Main page</h2>
      <Outlet />
    </div>
  );
};
