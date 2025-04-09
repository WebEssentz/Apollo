"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { CloudUpload, Loader2Icon, WandSparkles, X } from 'lucide-react'
import Image from 'next/image'
//@ts-ignore
import uuid4 from "uuid4";
import React, { ChangeEvent, useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { storage } from '@/configs/firebaseConfig'
import { useAuthContext } from '@/app/provider'
import { useRouter } from 'next/navigation'
import { MODEL_DETAILS } from '@/configs/modelConfig'
import { toast } from 'sonner'
import axios from 'axios'
import { ModelType } from '@/types/ai'


function ImageUpload() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null);
    const [selectedModel, setSelectedModel] = useState<string>(MODEL_DETAILS[0].model);
    const [description, setDescription] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuthContext();
    const router = useRouter();

    console.log(selectedModel)
    const OnImageSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                setFile(file);
                setPreviewUrl(URL.createObjectURL(file));
            } else {
                toast.error('Please select an image file');
            }
        }
    }

    const OnConverToCodeButtonClick = async () => {
        if (!file || !selectedModel || !description) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            const fileName = `${Date.now()}-${file.name}`;
            const imageRef = ref(storage, "Wireframe_To_Code/" + fileName);
            
            await uploadBytes(imageRef, file);
            const imageUrl = await getDownloadURL(imageRef);
            const uid = uuid4();

            const result = await axios.post('/api/wireframe-to-code', {
                uid,
                description,
                imageUrl,
                model: selectedModel,
                email: user?.email
            });

            if (result.data?.error) {
                toast.error(result.data.error);
                return;
            }

            router.push('/view-code/' + uid);
        } catch (error) {
            console.error('Conversion error:', error);
            toast.error('Failed to convert image to code');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='mt-10'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {!previewUrl ? (
                    <div className='p-7 border border-dashed rounded-md shadow-md flex flex-col items-center justify-center'>
                        <CloudUpload className='h-10 w-10 text-primary' />
                        <h2 className='font-bold text-lg'>Upload Wireframe</h2>
                        <p className='text-gray-400 mt-2'>Select your wireframe or mockup image</p>
                        <div className='p-5 border border-dashed w-full flex mt-4 justify-center'>
                            <label htmlFor='imageSelect' className='cursor-pointer'>
                                <h2 className='p-2 bg-blue-100 font-bold text-primary rounded-md px-5'>
                                    Select Image
                                </h2>
                            </label>
                        </div>
                        <input 
                            type="file" 
                            id='imageSelect'
                            className='hidden'
                            accept="image/*"
                            onChange={OnImageSelect}
                        />
                    </div>
                ) : (
                    <div className='p-5 border border-dashed rounded-lg'>
                        <div className='relative'>
                            <Image 
                                src={previewUrl} 
                                alt='preview' 
                                width={500} 
                                height={500}
                                className='w-full h-[250px] object-contain rounded-lg'
                            />
                            <button 
                                onClick={() => {
                                    setPreviewUrl(null);
                                    setFile(null);
                                }}
                                className='absolute top-2 right-2 p-1 bg-white rounded-full shadow-md'
                            >
                                <X className='h-4 w-4' />
                            </button>
                        </div>
                    </div>
                )}

                <div className='p-7 border shadow-md rounded-lg'>
                    <h2 className='font-bold text-lg'>Select AI Model</h2>
                    <div className='mt-4 space-y-4'>
                        {MODEL_DETAILS.map((model) => (
                            <TooltipProvider key={model.id}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            onClick={() => setSelectedModel(model.model)}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all
                                            ${model.model === selectedModel 
                                                ? 'border-blue-500 bg-blue-50' 
                                                : 'hover:border-gray-300'}`}
                                        >
                                            <div className='flex items-center gap-3'>
                                                <div className='w-8 h-8 relative'>
                                                    <Image
                                                        src={model.icon}
                                                        alt={model.name}
                                                        fill
                                                        className='object-contain'
                                                    />
                                                </div>
                                                <div className='flex-1'>
                                                    <div className='flex items-center gap-2'>
                                                        <h3 className='font-medium'>{model.name}</h3>
                                                        <Badge variant={
                                                            model.badge === 'Recommended' 
                                                                ? 'default' 
                                                                : model.badge === 'Premium' 
                                                                    ? 'secondary' 
                                                                    : 'outline'
                                                        }>
                                                            {model.badge}
                                                        </Badge>
                                                    </div>
                                                    <p className='text-sm text-gray-500'>
                                                        {model.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Click to select {model.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        ))}
                    </div>

                    <h2 className='font-bold text-lg mt-7'>Enter Description</h2>
                    <Textarea
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        className='mt-3 h-[150px]'
                        placeholder='Describe your webpage requirements in detail...'
                    />
                </div>
            </div>

            <div className='mt-10 flex items-center justify-center'>
                <Button 
                    onClick={OnConverToCodeButtonClick} 
                    disabled={loading || !file || !selectedModel || !description}
                    className='px-6'
                >
                    {loading ? (
                        <>
                            <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                            Converting...
                        </>
                    ) : (
                        <>
                            <WandSparkles className='mr-2 h-4 w-4' />
                            Convert to Code
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

export default ImageUpload