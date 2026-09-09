import { ImagePlus, RotateCcw, UploadCloud } from 'lucide-react'
import { useRef, useState } from 'react'

export function ImageUploader() {
    const [file, setFile] = useState<File | null>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const handleFile = (nextFile?: File) => { if (nextFile && ['image/jpeg', 'image/png', 'image/tiff'].includes(nextFile.type)) setFile(nextFile) }
    return <div className="uploader"><input ref={inputRef} hidden type="file" accept=".jpg,.jpeg,.png,.tif,.tiff" onChange={(event) => handleFile(event.target.files?.[0])} />{file ? <div className="file-ready">
        <ImagePlus size={22} /><div><strong>{file.name}</strong>
            <span>{(file.size / 1024 / 1024).toFixed(2)} MB ready for analysis</span></div><button className="text-button" onClick={() => setFile(null)}>
            <RotateCcw size={14} /> Reset</button>
    </div> : <button className="drop-zone" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); handleFile(event.dataTransfer.files[0]) }}>
        <span className="upload-icon"><UploadCloud size={21} /></span><strong>Drag & drop an image here</strong>
        <span>or <u>click to upload</u>
        </span><small>JPG, PNG, TIFF <i /> Max 10MB</small></button>}</div>
}
