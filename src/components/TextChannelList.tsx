import React from 'react'
import TextChannelListItem from './TextChannelListItem'

function TextChannelList({toggleEditTextChannelMenu}: {toggleEditTextChannelMenu: () => void}) {
  return (
    <div>
        {
            Array.from({ length: 5 }).map((_, index) => (
                <TextChannelListItem key={index} toggleEditTextChannelMenu={toggleEditTextChannelMenu} />
            ))
        }
    </div>
  )
}

export default TextChannelList