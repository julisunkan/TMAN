import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeBlockProps {
  content: string;
  language?: string;
  title?: string;
  copyable?: boolean;
  type?: 'code' | 'command';
}

export default function CodeBlock({ 
  content, 
  language = "bash", 
  title, 
  copyable = true,
  type = "code"
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Code has been copied to your clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy code to clipboard",
        variant: "destructive",
      });
    }
  };

  const getBackgroundGradient = () => {
    if (type === "command") {
      return "bg-gradient-to-r from-[hsl(227,39%,23%)] to-[hsl(240,10%,6%)]";
    }
    return "bg-gradient-to-r from-[hsl(240,6%,10%)] to-[hsl(227,39%,23%)]";
  };

  const getTextColor = () => {
    if (type === "command") {
      return "text-[hsl(120,100%,50%)]";
    }
    return "text-[hsl(207,90%,54%)]";
  };

  return (
    <div className={`rounded-lg border border-[hsl(240,3.7%,15.9%)] overflow-hidden ${getBackgroundGradient()}`}>
      {(title || language || copyable) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-[hsl(240,3.7%,15.9%)]">
          <div className="flex items-center space-x-2">
            {type === "command" && (
              <Terminal className="w-4 h-4 text-[hsl(120,100%,50%)]" />
            )}
            {title && (
              <span className="text-sm font-medium">{title}</span>
            )}
            {language && (
              <Badge variant="outline" className="text-xs">
                {language}
              </Badge>
            )}
          </div>
          {copyable && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="h-6 w-6 p-0 hover:bg-[hsl(240,3.7%,15.9%)]"
            >
              {copied ? (
                <Check className="w-3 h-3 text-[hsl(120,100%,50%)]" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          )}
        </div>
      )}
      
      <div className="p-4">
        <pre className="text-sm overflow-x-auto">
          <code className={`font-mono ${getTextColor()} whitespace-pre-wrap break-all`}>
            {content}
          </code>
        </pre>
      </div>
    </div>
  );
}
