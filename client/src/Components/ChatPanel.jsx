import { BotMessageSquareIcon, UserIcon } from "lucide-react";
import { useEffect, useRef } from "react"

const ChatPanel = ({messages, onSend, loading}) => {

    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior : "auto"})
    }, [messages, loading])

  return (
    <div className="flex flex-col h-full bg-white">

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 hide-scrollbar ">
            {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                    <p className="text-zinc-400 text-sm text-center">Ask AI to modify your website</p>
                </div>
            )}

            {
                messages.map((msg, i) => {
                    return <div key={i}>
                        <div className="flex gap-2.5 items-start">
                            <div className="shrink-0 w-6 h-6 rounded-md flex items-center justify-center mt-9.5 bg-zinc-50">
                                {msg.role === "user" ? (
                                    <UserIcon size={14} className="text-zinc-700" />
                                ) : (
                                    <BotMessageSquareIcon size={14} className="text-zinc-700" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-zinc-500 mb-1 uppercase tracking-order">{msg.role === "user" ? "You" : "AI"}</p>
                                <p>

                                </p>
                            </div>
                        </div>
                    </div>
                })
            }
        </div>
      
    </div>
  )
}

export default ChatPanel
