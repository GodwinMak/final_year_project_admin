export const Data = [
    {
        specialInsideSidebar: false,
        insideSidebar: false,
        previllage: ['admin', 'root'],
        icon: "fa fa-home",
        inside: [
            {
                text: 'Home',
                url: 'welcome'
            }
        ]
    },
    {
        specialInsideSidebar: true,
        insideSidebar: true,
        previllage: ['admin', 'user'],
        icon: "fa fa-wifi",
        inside: [
            {
                url: 'real_time',
                text: 'RealTime'
            }
        ]
    },
    {
        specialInsideSidebar: false,
        insideSidebar: true,
        previllage: ["admin", "root"],
        icon: 'fa-solid fa-user',
        inside: [
            {
                icon: 'fa-solid fa-eye',
                text: 'View Users',
                url: 'view_users'
            },
            {
                icon: 'fa-solid fa-user-plus',
                text: 'Add User',
                url: 'add_user'
            },
        ]
    },
    {
        specialInsideSidebar: false,
        insideSidebar: true,
        previllage: ['root'],
        icon: 'fa-solid fa-globe',
        inside: [
            {
                icon: 'fa-solid fa-eye',
                text: 'View Areas',
                url: 'view_areas'
            },
            {
                icon: 'fa-solid fa-plus',
                text: 'Add Area',
                url: 'add_area'
            }
        ]
    },
    {
        specialInsideSidebar: false,
        insideSidebar: true,
        previllage: ['admin'],
        icon: 'fa-solid fa-paw',
        inside: [
            {
                icon: 'fa-solid fa-hippo',
                text: 'List of Animals',
                url: 'view_animals'
            },
            {
                icon: 'fa-solid fa-plus',
                text: 'Add Animal',
                url: 'add_animal'
            }
        ]
    },
    {
        specialInsideSidebar: true,
        insideSidebar: true,
        previllage: ['user', 'admin'],
        icon: "fa fa-bar-chart",
        inside:[
            {
                url: "analysis"
            }
        ]
    },
    {
        specialInsideSidebar: false,
        insideSidebar: true,
        previllage: ['all'],
        icon: 'fa-solid fa-gear',
        inside: [
            // {
            //     icon: "fa-solid fa-user",
            //     text: "Profile",
            //     url: "profile"
            // },
            {
                icon: 'fa-solid fa-lock',
                text: 'Change Password',
                url: 'change_password'
            },
        ]
    }
]

