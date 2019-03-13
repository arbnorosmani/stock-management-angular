declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const appRoutes: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/profile', title: 'User Profile',  icon:'person', class: '' },
	{ path: '/users', title: 'Users',  icon:'person', class: '' },
];