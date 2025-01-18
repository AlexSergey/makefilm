import loadable from '@loadable/component';
import { Navigate } from 'react-router-dom';

import { MainPage } from './pages/main';

const Home = loadable(() => import('./pages/home.loadable'), {
  fallback: <div>Loading...</div>,
});

/*
import { withRoleAccess } from './features/user-management/hoc/role-access.hoc';
import { CreatePostPage } from './pages/create-post/create-post.page';
import { ResetPasswordPage } from './pages/user/reset-password/reset-password.page';
import { SignInPage } from './pages/user/signin/signin.page';
import { SignUpPage } from './pages/user/signup/signup.page';
import { SessionsPage } from './pages/user-settings/sessions/sessions.page';
import { UserProfilePage } from './pages/user-settings/user-profile/user-profile.page';
import { UserSettingsPage } from './pages/user-settings/user-settings.page';*/

/*

const NoMatch = () => <Navigate to="/" />;*/

export const routes = [
  {
    children: [
      {
        element: <Home />,
        path: '/',
      },
    ],
    element: <MainPage />,
    path: '/',
  },
];
/*
export const routes = [
  {
    element: <Home />,
    path: '/',
  },
  {
    element: <SignInPage />,
    path: '/user/sign-in',
  },
  {
    element: <SignUpPage />,
    path: '/user/sign-up',
  },
  {
    element: <ResetPasswordPage />,
    path: '/user/reset-password',
  },
  {
    element: <NoMatch />,
    path: '/user/*',
  },
  {
    element: withRoleAccess([UserRolesEnum.User, UserRolesEnum.Moderator, UserRolesEnum.Admin])(UserSettingsPage),
    path: '/user-settings',
  },
  {
    element: withRoleAccess([UserRolesEnum.User, UserRolesEnum.Moderator, UserRolesEnum.Admin])(UserProfilePage),
    path: '/user-settings/profile',
  },
  {
    element: withRoleAccess([UserRolesEnum.User, UserRolesEnum.Moderator, UserRolesEnum.Admin])(SessionsPage),
    path: '/user-settings/sessions',
  },
  {
    element: <NoMatch />,
    path: '/user-settings/*',
  },
  {
    element: withRoleAccess([UserRolesEnum.User, UserRolesEnum.Moderator, UserRolesEnum.Admin])(CreatePostPage),
    path: '/create-post',
  },
  {
    element: <NoMatch />,
    path: '*',
  },
];
*/
