import AddIcon from '@mui/icons-material/Add';
import { useWebSocket } from './websockets/WebSockets';
import MessageServiceApi from '../api/MessageServiceApi';
import { useCave } from './CaveProvider';
import { useEffect, useRef, useState } from 'react';
import MediaServiceApi from '../api/MediaServiceApi';
import permissionsService from './PermissionsService/PermissionsService';

function MessagePanel() {
    const { chatMessages } = useWebSocket();
    const { selectedCaveTextChannelId, selectedCaveBaseInfo } = useCave();
    const { subscribe_channel, setChatMessages } = useWebSocket();
    const { socket } = useWebSocket();

    const nextPageStateRef = useRef<any | undefined>("");
    const messageRef = useRef<HTMLDivElement>(null);

    const scrollableContainerRef = useRef<HTMLDivElement>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const [pastedImages, setPastedImages] = useState<File[]>([]);
    const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

    const cdnUrl = import.meta.env.VITE_CDN_URL;

    const sendMessage = () => {
        const messageContent = messageRef.current?.innerText;
    
        if ((!messageContent || messageContent.trim().length === 0) && pastedImages.length === 0) {
            return;
        }
    
        if (messageContent && messageContent.length > 255) return;
    
        if (selectedCaveTextChannelId) {
            const message = {
                channelId: selectedCaveTextChannelId,
                content: messageContent?.trim() || '', 
                attachments: pastedImages.map((image) => image.name), 
            };
    
            MessageServiceApi.sendMessage(message);
    
            if (messageRef.current) {
                messageRef.current.innerText = '';
            }
            setPastedImages([]);
        }
    };
    
    useEffect(() => {
        if (selectedCaveTextChannelId && socket) {
            MessageServiceApi.getMessages(selectedCaveTextChannelId, "").then((response) => {
                setChatMessages(response.messages.reverse());
                nextPageStateRef.current = response.nextPageState;
            })
                .then(() => subscribe_channel(selectedCaveTextChannelId))
                .catch((error) => {
                    console.error(error);
                })
        }

        const container = scrollableContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [selectedCaveTextChannelId, socket])

    useEffect(() => {
        if (isAtBottom) {
            scrollToBottom();
        }
    }, [chatMessages]);

    const scrollToBottom = () => {
        if (scrollableContainerRef.current) {
            scrollableContainerRef.current.scrollTop = scrollableContainerRef.current.scrollHeight;
        }
    };

    const loadOlderMessages = async () => {
        if (selectedCaveTextChannelId && nextPageStateRef.current) {
            const container = scrollableContainerRef.current;
            if (!container) return;

            const previousScrollHeight = container.scrollHeight;
            const previousScrollTop = container.scrollTop;

            const response = await MessageServiceApi.getMessages(selectedCaveTextChannelId, nextPageStateRef.current);
            nextPageStateRef.current = response.nextPageState;

            if (response.messages && response.messages.length > 0) {
                setChatMessages((prevMessages) => [...response.messages.reverse(), ...prevMessages]);

                setTimeout(() => {
                    const newScrollHeight = container.scrollHeight;
                    container.scrollTop = newScrollHeight - previousScrollHeight + previousScrollTop;
                }, 0);
            }
        }
    };

    const handleScroll = () => {
        const container = scrollableContainerRef.current;
        if (!container) return;

        let isUserAtBottom = false;
        if (container.clientHeight + 1 > container.scrollHeight - container.scrollTop && container.scrollHeight - container.scrollTop >= container.clientHeight) {
            isUserAtBottom = true;
        }

        setIsAtBottom(isUserAtBottom);

        if (container.scrollTop === 0) {
            loadOlderMessages();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatMessageTimestamp = (timestamp: string): string => {
        const date = new Date(timestamp);

        const day = date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        const hours = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        return `${day} - ${hours}`;
    }

    useEffect(() => {
        if (messageRef.current) {
            messageRef.current.addEventListener('paste', handlePaste as EventListener);
        }
        return () => {
            if (messageRef.current) {
                messageRef.current.removeEventListener('paste', handlePaste as EventListener);
            }
        };
    }, []);

    const handlePaste = (event: ClipboardEvent) => {
        if (event.clipboardData) {
            const items = event.clipboardData.items;

            if (pastedImages.length + items.length > 5) {
                console.error('Cannot paste more than 5 images at once');
                return;
            }
            
            const processPaste = async () => {
                const newImages: File[] = [];

                if (pastedImages.length + items.length > 5) {
                    console.error('Cannot paste more than 5 images at once');
                    return;
                }

                for (let i = 0; i < items.length; i++) {
                    if (items[i].type.startsWith('image/')) {
                        const file = items[i].getAsFile();
                        if (file) {
                            // Check if the file already exists in the state
                            const isDuplicate = pastedImages.some(
                                (image) => image.name === file.name && image.size === file.size
                            );

                            if (!isDuplicate) {
                                try {
                                    const response = await MediaServiceApi.uploadImage(file);
                                    const updatedFile = new File([file], response, { type: file.type });
                                    newImages.push(updatedFile);
                                } catch (error) {
                                    console.error('Failed to upload image:', error);
                                }
                            }
                        }
                    }
                }

                if (newImages.length > 0) {
                    setPastedImages((prevImages) => [...prevImages, ...newImages]);
                }
            };

            processPaste();
            event.preventDefault();
        }
    };

    const removeImage = (index: number) => {
        setPastedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    return (
        <div className='bg-primary-100 text-secondary-100 flex h-screen flex-col justify-between'>
            <div className='overflow-y-auto flex-grow' ref={scrollableContainerRef}>
                {
                    chatMessages.map((message, index) => (
                        <div key={index} className='overflow-hidden'>
                            <div className='flex gap-2 mt-6 p-3 hover:bg-secondary-300'>
                                <div className='w-fit'>
                                    <div className='bg-white w-[3rem] h-[3rem] rounded-full'> </div>
                                </div>
                                <div className='break-all overflow-hidden w-full'>
                                    <div className='flex justify-between gap-3 w-full'>
                                        <h2 className="font-bold">{message.author.username}</h2>
                                        <span>{formatMessageTimestamp(message.timestamp)}</span>
                                    </div>
                                    <p>{message.content}</p>
                                    {
                                        message.attachments && message.attachments.map((attachment: string, index: number) => (
                                            <div key={index} className='flex gap-2 mt-2 hover:bg-secondary-300'>
                                                <div className='w-fit'>
                                                <img
                                                src={`${cdnUrl}/images/${attachment}`}
                                                alt="attachment"
                                                className="h-32 object-cover rounded-md cursor-pointer"
                                                onClick={() =>
                                                    setEnlargedImage(`${cdnUrl}/images/${attachment}`)
                                                }
                                                />
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            {
                selectedCaveBaseInfo && permissionsService.canSendMessage(selectedCaveBaseInfo.userPermissionsCache.cavePermissions) ? (
                    <div className='p-3 h-fit w-full'>
                    <div className='bg-primary-200 rounded-xl p-1 gap-2 flex items-center overflow-y-auto max-h-[50vh] '>
                        <div className='ml-2 sticky top-0 h-full'>
                            <AddIcon />
                        </div>
                        <div
                            onKeyDown={handleKeyDown}
                            contentEditable="true"
                            role="textbox"
                            aria-multiline="true"
                            className="w-full bg-primary-200 text-secondary-100 text-lg p-3 pl-0 outline-none "
                            style={{
                                minHeight: '44px',
                                overflowWrap: 'break-word',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                            }}
                            ref={messageRef}
                        ></div>
                        <div className='flex flex-wrap gap-2 mt-2'>
                            {pastedImages.map((image, index) => (
                                <div key={index} className='relative'>
                                    <img
                                        src={URL.createObjectURL(image)}
                                        alt="pasted"
                                        className='w-16 h-16 object-cover rounded-md'
                                    />
                                    <button
                                        onClick={() => removeImage(index)}
                                        className='absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs'
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                        {/* <input type="text" placeholder='write a message' className="w-full h-full bg-primary-200 text-secondary-100 text-lg p-3 outline-none" /> */}
                    </div>
                </div>
                ) : (
                    <div className='p-3 h-fit w-full text-center'>
                        <h1>Cannot send messages</h1>
                    </div>
                )
            }
            {enlargedImage && (
            <ImageModal src={enlargedImage} onClose={() => setEnlargedImage(null)} />
            )}
        </div>
    )
}

const ImageModal = ({ src, onClose }: { src: string; onClose: () => void }) => {
    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div className="relative">
                <img
                    src={src}
                    alt="Enlarged"
                    className="max-w-full max-h-full rounded-md"
                />
                <button
                    className="absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClose();
                    }}
                >
                    ×
                </button>
            </div>
        </div>
    );
};


export default MessagePanel