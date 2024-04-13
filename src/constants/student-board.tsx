import { Badge } from '@/components/ui/badge'
import { membership_statuses } from './membership-status'

export type BoardItemType = {
  name: string
  value: string
  afterText?: string
  beforeText?: string
  process: (value: any) => any
}

export const studentBoardList: BoardItemType[] = [
  {
    name: 'First Name',
    value: 'first_name',
    process: value => value
  },
  {
    name: 'Last Name',
    value: 'last_name',
    process: value => value
  },
  {
    name: 'Phone Number',
    value: 'phone_number',
    process: value => value
  },
  {
    name: 'Email',
    value: 'email',
    process: value => value
  },
  {
    name: 'Membership Status',
    value: 'membership_status',
    process: value => {
      const variant =
        value === 'active'
          ? 'default'
          : value === 'inactive'
          ? 'outline'
          : 'secondary'
      return (
        <Badge variant={variant}>
          {membership_statuses.find(status => status.value === value)?.name ||
            value}
        </Badge>
      )
    }
  }
]

export const studentsLimitBoard = 10
