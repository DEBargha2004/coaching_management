import {
  BookMarked,
  CalendarCheck,
  GraduationCap,
  IndianRupee,
  LayoutDashboard,
  School,
  UsersRound
} from 'lucide-react'

type NavItemType = {
  name: string
  href: string
  type: 'link' | 'accordion'
  items?: NavItemType[]
  icon?: (className: string) => React.ReactNode
}

export const navlist: NavItemType[] = [
  {
    name: 'Dashboard',
    href: '/',
    type: 'link',
    icon: className => <LayoutDashboard className={className} />
  },
  {
    name: 'Schedules',
    href: '/sh',
    type: 'link',
    icon: className => <CalendarCheck className={className} />
  },
  {
    name: 'Teachers',
    href: '/t?p=1',
    type: 'link',
    icon: className => <GraduationCap className={className} />
  },
  {
    name: 'Students',
    href: '/s',
    type: 'link',
    icon: className => <UsersRound className={className} />
  },
  {
    name: 'Batches',
    href: '/b',
    type: 'link',
    icon: className => <School className={className} />
  },
  {
    name: 'Subjects',
    href: '/sub',
    type: 'link',
    icon: className => <BookMarked className={className} />
  },
  {
    name: 'Payments',
    href: '/pay',
    type: 'accordion',
    icon: className => <IndianRupee className={className} />,
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
