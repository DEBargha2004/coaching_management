type NavItemType = {
  name: string
  href: string
  type: 'link' | 'accordion'
  items?: NavItemType[]
}

export const navlist: NavItemType[] = [
  {
    name: 'Dashboard',
    href: '/',
    type: 'link'
  },
  {
    name: 'Teachers',
    href: '/t',
    type: 'link'
  },
  {
    name: 'Students',
    href: '/s',
    type: 'link'
  },
  {
    name: 'Batches',
    href: '/b',
    type: 'link'
  },
  {
    name: 'Subjects',
    href: '/sub',
    type: 'link'
  },
  {
    name: 'Payments',
    href: '/pay',
    type: 'accordion',
    items: [
      {
        name: 'Students',
        href: '/pay/s',
        type: 'link'
      },
      {
        name: 'Teachers',
        href: '/pay/t',
        type: 'link'
      }
    ]
  }
]
