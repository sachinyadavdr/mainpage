import { ArrowUpRight, MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { ImageUploader } from './ImageUploader'

const examples = ['Detect water bodies', 'Show vegetation areas', 'Is there urban expansion?', 'Any signs of deforestation?']

export function UploadAnalysis() {
    const [question, setQuestion] = useState('')
    return <section className="upload-panel">
        <div className="upload-heading">
            <div><span className="eyebrow">NEW ANALYSIS</span>
                <h2>Analyze a New Satellite Image</h2>
                <p>Upload an image and ask anything about the Earth.</p>
            </div>
            <span className="upload-step">STEP 01 <i /> STEP 02</span>
        </div>
        <div className="upload-grid"><div><h3><span>1</span> Upload Satellite Image</h3>
            <ImageUploader /></div>
            <div className="question-area">
                <h3><span>2</span> Ask Your Question</h3>
                <label className="question-box"><MessageSquare size={17} />
                    <textarea maxLength={500} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="e.g. What are the major land use types visible in this image?" />
                    <small>{question.length}/500</small>
                </label>
                <div className="question-examples">{examples.map((example) => <button key={example} onClick={() => setQuestion(example)}>{example}</button>)}
                </div><button className="analyze-button">Analyze Image <ArrowUpRight size={18} />
                </button>
            </div>
        </div>
    </section>
}
