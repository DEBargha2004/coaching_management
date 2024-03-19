import { teacher_membership_statuses } from './membership-status'

export type BoardItemType = {
  name: string
  value: string
  afterText?: string
  beforeText?: string
  process: (value: any) => any
}

export const teacherBoardList: BoardItemType[] = [
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
    name: 'Address',
    value: 'address',
    process: value => value
  },
  {
    name: 'Salary',
    value: 'salary',
    beforeText: '₹ ',
    process: value => value
  },
  {
    name: 'Membership Status',
    value: 'membership_status',
    process: value =>
      teacher_membership_statuses.find(status => status.value === value)?.name
  }
]
