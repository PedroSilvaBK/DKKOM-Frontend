import React from 'react'
import VoiceChannelListItem from './VoiceChannelListItem'

function VoiceChannelList({toggleEditVoiceChannelMenu}: {toggleEditVoiceChannelMenu: () => void}) {
  return (
    <div>
        {
            Array.from({ length: 5 }).map((_, index) => (
                <VoiceChannelListItem key={index} toggleEditVoiceChannelMenu={toggleEditVoiceChannelMenu} />
            ))
        }
    </div>
  )
}

export default VoiceChannelList