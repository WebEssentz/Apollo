import { RECORD } from '@/app/view-code/[uid]/page'
import { Button } from '@/components/ui/button'
import { MODEL_DETAILS } from '@/configs/modelConfig'
import { Badge } from "@/components/ui/badge"
import { Code } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function DesignCard({ item }: { item: RECORD }) {
    const modelObj = item && MODEL_DETAILS.find((x => x.model === item?.model))

    return (
        <div className='p-5 border rounded-lg hover:shadow-md transition-all'>
            <Image src={item?.imageUrl} alt='design preview'
                width={300} height={200}
                className='w-full h-[200px] object-cover bg-white rounded-lg'
            />

            <div className='mt-2'>
                <h2 className='line-clamp-3 text-gray-400 text-sm'>{item?.description}</h2>
                <div className='flex justify-between items-center mt-4'>
                    {modelObj && (
                        <div className='flex items-center gap-2 p-2 bg-gray-50 rounded-full'>
                            <Image 
                                src={modelObj.icon} 
                                alt={modelObj.name}
                                width={30}
                                height={30}
                                className='object-contain'
                            />
                            <div className='flex items-center gap-2'>
                                <h2 className='font-medium'>{modelObj.name}</h2>
                                <Badge variant={
                                    modelObj.badge === 'Recommended' 
                                        ? 'default' 
                                        : modelObj.badge === 'Premium' 
                                            ? 'secondary' 
                                            : 'outline'
                                }>
                                    {modelObj.badge}
                                </Badge>
                            </div>
                        </div>
                    )}
                    <Link href={'/view-code/' + item?.uid}>
                        <Button variant="default">
                            <Code className="mr-2 h-4 w-4" /> 
                            View Code
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default DesignCard