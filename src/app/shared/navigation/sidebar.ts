declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const appRoutes: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },

    { path: '/products', title: 'Products',  icon:'shopping_cart', class: '' },
    { path: '/brands', title: 'Brands',  icon:'branding_watermark', class: '' },
    { path: '/categories', title: 'Categories',  icon:'category', class: '' },

    { path: '/users', title: 'Users',  icon:'supervisor_account', class: '' },
    { path: '/profile', title: 'Profile',  icon:'person', class: '' },

    { path: '/settings', title: 'Settings',  icon:'settings', class: '' },
];