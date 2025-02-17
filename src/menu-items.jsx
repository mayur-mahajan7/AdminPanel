const menuItems = {
  items: [
    {
      id: 'navigation',
      title: 'Navigation',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/default'
        }
      ]
    },
    // {
    //   id: 'ui-forms',
    //   title: 'FORMS & TABLES',
    //   type: 'group',
    //   icon: 'icon-group',
    //   children: [
    //     {
    //       id: 'forms',
    //       title: 'Form Elements',
    //       type: 'item',
    //       icon: 'feather icon-file-text',
    //       url: '/forms/form-basic'
    //     },
    //     {
    //       id: 'table',
    //       title: 'Table',
    //       type: 'item',
    //       icon: 'feather icon-server',
    //       url: '/tables/bootstrap'
    //     }
    //   ]
    // },
    {
      id: 'pages',
      title: 'Pages',
      type: 'group',
      icon: 'icon-pages',
      children: [
        // {
        //   id: 'auth',
        //   title: 'Authentication',
        //   type: 'collapse',
        //   icon: 'feather icon-lock',
        //   badge: {
        //     title: 'New',
        //     type: 'label-danger'
        //   },
        //   children: [
        //     // {
        //     //   id: 'signup-1',
        //     //   title: 'Sign up',
        //     //   type: 'item',
        //     //   url: '/auth/signup-1',
        //     //   target: true,
        //     //   breadcrumbs: false
        //     // },
        //     {
        //       id: 'signin-1',
        //       title: 'Sign in',
        //       type: 'item',
        //       url: '/auth/signin-1',
        //       target: true,
        //       breadcrumbs: false
        //     }
        //   ]
        // },
        // {
        //   id: 'menu-level',
        //   title: 'Menu Levels',
        //   type: 'collapse',
        //   icon: 'feather icon-menu',
        //   children: [
        //     {
        //       id: 'menu-level-1.1',
        //       title: 'Menu Level 1.1',
        //       type: 'item',
        //       url: '#!'
        //     },
        //     {
        //       id: 'menu-level-1.2',
        //       title: 'Menu Level 2.2',
        //       type: 'collapse',
        //       children: [
        //         {
        //           id: 'menu-level-2.1',
        //           title: 'Menu Level 2.1',
        //           type: 'item',
        //           url: '#'
        //         },
        //         {
        //           id: 'menu-level-2.2',
        //           title: 'Menu Level 2.2',
        //           type: 'collapse',
        //           children: [
        //             {
        //               id: 'menu-level-3.1',
        //               title: 'Menu Level 3.1',
        //               type: 'item',
        //               url: '#'
        //             },
        //             {
        //               id: 'menu-level-3.2',
        //               title: 'Menu Level 3.2',
        //               type: 'item',
        //               url: '#'
        //             }
        //           ]
        //         }
        //       ]
        //     }
        //   ]
        // },
        {
          id: 'logout',
          title: 'Log Out',
          type: 'item',
          icon: 'feather icon-log-out',
          url: '/logout'
        }
      ]
    }
  ]
};

export default menuItems;
