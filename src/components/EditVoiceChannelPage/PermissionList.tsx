import PermissionListItem from './PermissionListItem'
import { Permission } from '../PermissionType'

function PermissionList({setFieldValue, values}: {setFieldValue: any, values: any}) {
  const permissions: Permission[] = [
    {
      name: 'SEE_CHANNEL',
      id: 1,
      description: "This permission allows the user to see the channel"
    },
    {
      name: 'SEND_MESSAGES',
      id: 1 << 2,
      description: "This permission allows the user to send messages in the channel"
    },
    {
      name: 'CONNECT',
      id: 1 << 3,
      description: "This permission allows the user to connect to the voice channel"
    },
    {
      name: 'SPEAK',
      id: 1 << 4,
      description: "This permission allows the user to speak in the voice channel"
    },
    {
      name: 'VIDEO',
      id: 1 << 5,
      description: "This permission allows the user to send video in the voice channel"
    },
    {
      name: 'MOVE_MEMBERS',
      id: 1 << 6,
      description: "This permission allows the user to move members in the voice channel"
    }
  ]

  return (
    <div className='flex flex-col gap-6'>
      {
        permissions.map((permission, index) => (
          <PermissionListItem key={index} permission={permission} allow={values?.allow} deny={values?.deny} setFieldValue={setFieldValue} />
        ))
      }
    </div>
  )
}

export default PermissionList