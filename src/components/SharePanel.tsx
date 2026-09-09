import { useState, useRef, useEffect } from 'react';
import { Copy, Check, MessageCircle, Mail, Download, QrCode } from 'lucide-react';
import Button from './ui/Button';
import QRCode from 'qrcode';

interface SharePanelProps {
  url: string;
  title: string;
}

export default function SharePanel({ url, title }: SharePanelProps) {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    QRCode.toCanvas(canvasRef.current, url, {
      width: 180,
      margin: 2,
      color: { dark: '#1c1917', light: '#ffffff' },
    }).catch(() => {});
    QRCode.toDataURL(url, { width: 300, margin: 2 }).then(setQrDataUrl).catch(() => {});
  }, [url]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check this out: ${url}`)}`;

  const handleDownloadQR = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'qr-code.png';
    link.click();
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Your shareable link
        </label>
        <div className="flex gap-2">
          <input
            readOnly
            value={url}
            className="flex-1 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-600"
          />
          <Button onClick={handleCopy} variant={copied ? 'secondary' : 'primary'}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500 text-white font-medium hover:bg-green-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </a>
        <a
          href={emailUrl}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Email
        </a>
      </div>

      <div className="rounded-2xl border border-stone-100 p-4 bg-stone-50 text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <QrCode className="w-4 h-4 text-stone-500" />
          <p className="text-sm font-medium text-stone-600">QR Code</p>
        </div>
        <canvas ref={canvasRef} className="mx-auto rounded-lg" />
        <button
          onClick={handleDownloadQR}
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-rose-600 hover:text-rose-700 font-medium"
        >
          <Download className="w-4 h-4" />
          Download QR Code
        </button>
      </div>
    </div>
  );
}
