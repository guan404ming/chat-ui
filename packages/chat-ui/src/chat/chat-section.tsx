import { useState } from 'react'
import { cn } from '../lib/utils'
import ChatInput from './chat-input'
import ChatMessages from './chat-messages'
import { ChatProvider } from './chat.context'
import { type ChatHandler } from './chat.interface'

export interface ChatSectionProps extends React.PropsWithChildren {
  handler: Omit<ChatHandler, 'chat' | 'requestData' | 'setRequestData'> & {
    chat?: ChatHandler['chat']
  }
  className?: string
}

export default function ChatSection(props: ChatSectionProps) {
  const { handler, className } = props
  const [requestData, setRequestData] = useState<any>()

  if (!handler.chat && !handler.append) {
    throw new Error(
      'Please provide chat or append function to handle submit messages'
    )
  }

  const chat =
    props.handler.chat ??
    (async (input: string, data?: any) => {
      props.handler.setInput('')
      await handler.append?.({ content: input, role: 'user' }, { data })
    })

  const children = props.children ?? (
    <>
      <ChatMessages />
      <ChatInput />
    </>
  )

  return (
    <ChatProvider value={{ ...handler, chat, requestData, setRequestData }}>
      <div className={cn('flex flex-col gap-4', className)}>{children}</div>
    </ChatProvider>
  )
}
