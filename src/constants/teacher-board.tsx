export type BoardItemType = {
  name: string
  value: string
  afterText?: string
  beforeText?: string
}

export const teacherBoardList: BoardItemType[] = [
  {
    name: 'First Name',
    value: 'first_name'
  },
  {
    name: 'Last Name',
    value: 'last_name'
  },
  {
    name: 'Phone Number',
    value: 'phone_number'
  },
  {
    name: 'Email',
    value: 'email'
  },
  {
    name: 'Address',
    value: 'address'
  },
  {
    name: 'Salary',
    value: 'salary',
    beforeText: '₹ '
  }
]
