import { RotateCcw, UploadCloud } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export interface UploadedImage {
    id: string
    file: File
    preview: string
}

interface ImageUploaderProps {
    onImagesChange?: (images: UploadedImage[]) => void
}

const acceptedTypes = ['image/jpeg', 'image/png', 'image/tiff']
const maxFileSize = 10 * 1024 * 1024

export function ImageUploader({ onImagesChange }: ImageUploaderProps) {
    const [images, setImages] = useState<UploadedImage[]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const imagesRef = useRef(images)

    useEffect(() => {
        imagesRef.current = images
        onImagesChange?.(images)
    }, [images, onImagesChange])

    useEffect(() => () => {
        imagesRef.current.forEach((image) => URL.revokeObjectURL(image.preview))
    }, [])

    const addFiles = (files: FileList | File[]) => {
        const existingFiles = new Set(images.map(({ file }) => `${file.name}-${file.size}-${file.lastModified}-${file.type}`))
        const nextImages = Array.from(files)
            .filter((file) => acceptedTypes.includes(file.type) && file.size <= maxFileSize)
            .filter((file) => {
                const key = `${file.name}-${file.size}-${file.lastModified}-${file.type}`
                if (existingFiles.has(key)) return false
                existingFiles.add(key)
                return true
            })
            .map((file) => ({ id: crypto.randomUUID(), file, preview: URL.createObjectURL(file) }))

        if (nextImages.length) setImages((currentImages) => [...currentImages, ...nextImages])
    }

    const removeImage = (id: string) => {
        setImages((currentImages) => {
            const image = currentImages.find((item) => item.id === id)
            if (image) URL.revokeObjectURL(image.preview)
            return currentImages.filter((item) => item.id !== id)
        })
    }

    const openFilePicker = () => inputRef.current?.click()

    return <div className="uploader">
        <input ref={inputRef} hidden type="file" accept="image/jpeg,image/png,image/tiff" multiple onChange={(event) => { addFiles(event.target.files ?? []); event.target.value = '' }} />
        {images.length ? <div className={images.length === 1 ? 'file-ready' : 'file-ready multi-file-ready'} onClick={openFilePicker} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addFiles(event.dataTransfer.files) }}>
            {images.length === 1 ? <>
                <img className="uploaded-thumbnail" src={images[0].preview} alt={images[0].file.name} />
                <div>
                    <strong>{images[0].file.name}

                    </strong>

                    <span>{(images[0].file.size / 1024 / 1024).toFixed(2)} MB ready for analysis</span>
                </div>
                <button className="text-button" onClick={(event) => { event.stopPropagation(); removeImage(images[0].id) }}>
                    <RotateCcw size={14} /> Reset</button>
            </> : <div className="uploaded-image-list">{images.map((image) => <div className="uploaded-image" key={image.id}>
                <img src={image.preview} alt={image.file.name} />
                <strong title={image.file.name}>{image.file.name}</strong>
                <button className="remove-image" aria-label={`Remove ${image.file.name}`} onClick={(event) => { event.stopPropagation(); removeImage(image.id) }}>×</button>
            </div>)}</div>}
        </div> : <button className="drop-zone" onClick={openFilePicker} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); addFiles(event.dataTransfer.files) }}>
            <span className="upload-icon">
                <UploadCloud size={21} /></span>
            <strong>Drag & drop an image here</strong>
            <span>or <u>click to upload</u>
            </span>
            <small>JPG, PNG, TIFF <i /> Max 10MB</small>
        </button>}
    </div>
}
