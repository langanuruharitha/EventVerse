'use client';

import { useRef, useEffect, useState } from 'react';
import { InvitationTemplate, renderTemplate } from '@/lib/templates/invitation-templates';
import html2canvas from 'html2canvas';

interface TemplatePreviewProps {
  template: InvitationTemplate;
  data: {
    eventName: string;
    hostNames: string;
    guestNames?: string;
    date: string;
    time: string;
    venue: string;
    message: string;
  };
  onDownload?: (imageUrl: string) => void;
}

export default function TemplatePreview({ template, data, onDownload }: TemplatePreviewProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Render the template HTML
  const renderedHTML = renderTemplate(template, data);
  
  const generateImage = async () => {
    if (!previewRef.current) return;
    
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imageUrl = canvas.toDataURL('image/png');
      
      if (onDownload) {
        onDownload(imageUrl);
      }
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="template-preview-container">
      <div className="preview-wrapper">
        <div
          ref={previewRef}
          className="template-render"
          dangerouslySetInnerHTML={{ __html: renderedHTML }}
        />
      </div>
      
      <div className="preview-actions">
        <button
          onClick={generateImage}
          disabled={isGenerating}
          className="generate-button"
        >
          {isGenerating ? (
            <>
              <span className="spinner">⏳</span>
              Generating...
            </>
          ) : (
            <>
              <span>📥</span>
              Generate & Download
            </>
          )}
        </button>
      </div>
      
      <style jsx>{`
        .template-preview-container {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .preview-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          background: #f0f0f0;
          padding: 40px;
          border-radius: 12px;
          overflow: auto;
        }
        
        .template-render {
          transform-origin: top center;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
        }
        
        .preview-actions {
          display: flex;
          justify-content: center;
        }
        
        .generate-button {
          padding: 16px 32px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.3s ease;
        }
        
        .generate-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(99,102,241,0.4);
        }
        
        .generate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .spinner {
          display: inline-block;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
